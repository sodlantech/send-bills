// ============================================================
// FIREBASE CLOUD FUNCTIONS — Send-Bills.com
// ============================================================
//
// SETUP:
// 1. cd cloud-functions
// 2. npm init -y
// 3. npm install firebase-admin firebase-functions @sendgrid/mail stripe cors
// 4. Set environment config:
//    firebase functions:config:set sendgrid.key="SG.xxxxx"
//    firebase functions:config:set sendgrid.verified_sender="invoices@send-bills.com"
//    firebase functions:config:set app.url="https://send-bills.com"
// 5. firebase deploy --only functions
//
// IMPORTANT: Read EMAIL-SETUP.md for SPF/DKIM/DMARC DNS setup
// to ensure emails don't land in spam.
//
// ============================================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();

// Helper: sanitize text for email (prevent XSS in HTML emails)
function sanitize(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Helper: generate plain text version of invoice email
function buildPlainText(inv, cur, viewUrl) {
  const docType = inv.docType || 'Invoice';
  let text = `${docType} ${inv.num || ''} from ${inv.fromName || 'Send-Bills.com'}\n`;
  text += `${'='.repeat(50)}\n\n`;
  text += `Hi${inv.toName ? ' ' + inv.toName : ''},\n\n`;
  text += `You have received a new ${docType.toLowerCase()} from ${inv.fromName || 'a business'}.\n\n`;
  text += `Amount Due: ${cur}${(inv.grand || 0).toFixed(2)}\n`;
  text += `Due Date: ${inv.due || 'On receipt'}\n\n`;
  text += `View and pay online: ${viewUrl}\n\n`;
  text += `${'-'.repeat(40)}\n`;
  text += `From: ${inv.fromName || ''}\n`;
  text += `${docType} #: ${inv.num || ''}\n`;
  text += `Date: ${inv.date || ''}\n`;
  text += `Due: ${inv.due || ''}\n`;
  if (inv.fromEmail) text += `Email: ${inv.fromEmail}\n`;
  if (inv.fromAddr) text += `Address: ${inv.fromAddr}\n`;
  text += `\n`;

  // Items
  if (inv.items && inv.items.length > 0) {
    text += `Items:\n`;
    inv.items.forEach(item => {
      text += `  - ${item.name || 'Item'} (Qty: ${item.qty || 0}) — ${cur}${(item.total || 0).toFixed(2)}\n`;
      if (item.desc) text += `    ${item.desc}\n`;
    });
    text += `\nSubtotal: ${cur}${(inv.sub || 0).toFixed(2)}\n`;
    text += `Tax (${inv.taxRate || 0}%): ${cur}${(inv.taxAmt || 0).toFixed(2)}\n`;
    text += `TOTAL: ${cur}${(inv.grand || 0).toFixed(2)}\n\n`;
  }

  if (inv.notes) text += `Notes: ${inv.notes}\n\n`;
  if (inv.terms) text += `Terms & Conditions: ${inv.terms}\n\n`;

  text += `---\nSent via Send-Bills.com — Free Invoice Generator\n`;
  return text;
}

// Helper: build HTML email body
function buildHtmlEmail(inv, cur, viewUrl) {
  const docType = sanitize(inv.docType || 'Invoice');
  const fromName = sanitize(inv.fromName || 'Send-Bills.com');
  const toName = sanitize(inv.toName || '');
  const invNum = sanitize(inv.num || '');

  // Build items HTML
  let itemsHtml = '';
  if (inv.items && inv.items.length > 0) {
    itemsHtml = `
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr style="background:#F0FDFA">
          <th style="text-align:left;padding:8px 10px;font-size:12px;color:#0D9488;font-weight:700">Item</th>
          <th style="text-align:center;padding:8px 10px;font-size:12px;color:#0D9488;font-weight:700">Qty</th>
          <th style="text-align:right;padding:8px 10px;font-size:12px;color:#0D9488;font-weight:700">Price</th>
          <th style="text-align:right;padding:8px 10px;font-size:12px;color:#0D9488;font-weight:700">Total</th>
        </tr>
        ${inv.items.map((item, i) => `
          <tr style="background:${i % 2 ? '#F9FAFB' : '#fff'}">
            <td style="padding:8px 10px;font-size:13px;color:#374151;border-bottom:1px solid #F3F4F6">
              <strong>${sanitize(item.name || '')}</strong>
              ${item.desc ? '<br><span style="color:#9CA3AF;font-size:11px">' + sanitize(item.desc) + '</span>' : ''}
            </td>
            <td style="padding:8px 10px;font-size:13px;color:#374151;text-align:center;border-bottom:1px solid #F3F4F6">${item.qty || 0}</td>
            <td style="padding:8px 10px;font-size:13px;color:#374151;text-align:right;border-bottom:1px solid #F3F4F6">${cur}${(item.price || 0).toFixed(2)}</td>
            <td style="padding:8px 10px;font-size:13px;color:#111827;text-align:right;font-weight:600;border-bottom:1px solid #F3F4F6">${cur}${(item.total || 0).toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
      <table style="width:220px;margin-left:auto;font-size:13px">
        <tr><td style="padding:3px 0;color:#6B7280">Subtotal</td><td style="padding:3px 0;text-align:right;color:#111827">${cur}${(inv.sub || 0).toFixed(2)}</td></tr>
        <tr><td style="padding:3px 0;color:#6B7280">Tax (${inv.taxRate || 0}%)</td><td style="padding:3px 0;text-align:right;color:#111827">${cur}${(inv.taxAmt || 0).toFixed(2)}</td></tr>
        <tr><td colspan="2" style="border-top:2px solid #0D9488;padding-top:8px"></td></tr>
        <tr><td style="padding:3px 0;font-size:16px;font-weight:800;color:#0D9488">Total</td><td style="padding:3px 0;text-align:right;font-size:16px;font-weight:800;color:#0D9488">${cur}${(inv.grand || 0).toFixed(2)}</td></tr>
      </table>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F8FAFB;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFB;padding:24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- Header -->
  <tr><td style="background:#0D9488;padding:24px;text-align:center;border-radius:10px 10px 0 0">
    <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700">${docType} ${invNum}</h1>
    <p style="color:#A7F3D0;margin:4px 0 0;font-size:13px">from ${fromName}</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:28px 24px;border:1px solid #E5E7EB;border-top:none">

    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hi${toName ? ' ' + toName : ''},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px">You have received a new ${docType.toLowerCase()} from <strong>${fromName}</strong>. Please review the details below.</p>

    <!-- Amount box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
    <tr><td style="background:#F0FDFA;border-radius:10px;padding:24px;text-align:center">
      <p style="color:#6B7280;font-size:13px;margin:0 0 4px">Amount Due</p>
      <p style="color:#0D9488;font-size:34px;font-weight:900;margin:0">${cur}${(inv.grand || 0).toFixed(2)}</p>
      <p style="color:#6B7280;font-size:12px;margin:6px 0 0">Due: ${sanitize(inv.due || 'On receipt')}</p>
    </td></tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
    <tr><td align="center">
      <a href="${viewUrl}" style="background:#0D9488;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;mso-padding-alt:14px 36px">View &amp; Pay Invoice</a>
    </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0">

    <!-- Invoice details table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#374151">
      <tr><td style="padding:4px 0;color:#6B7280;width:120px">From:</td><td style="padding:4px 0"><strong>${fromName}</strong></td></tr>
      ${inv.fromEmail ? `<tr><td style="padding:4px 0;color:#6B7280">Email:</td><td style="padding:4px 0">${sanitize(inv.fromEmail)}</td></tr>` : ''}
      ${inv.fromAddr ? `<tr><td style="padding:4px 0;color:#6B7280">Address:</td><td style="padding:4px 0">${sanitize(inv.fromAddr).replace(/\n/g, '<br>')}</td></tr>` : ''}
      <tr><td style="padding:4px 0;color:#6B7280">${docType} #:</td><td style="padding:4px 0">${invNum}</td></tr>
      <tr><td style="padding:4px 0;color:#6B7280">Date:</td><td style="padding:4px 0">${sanitize(inv.date || '')}</td></tr>
      <tr><td style="padding:4px 0;color:#6B7280">Due:</td><td style="padding:4px 0">${sanitize(inv.due || '')}</td></tr>
    </table>

    <!-- Line items -->
    ${itemsHtml}

    <!-- Notes -->
    ${inv.notes ? `<div style="background:#F9FAFB;padding:14px;border-radius:8px;margin-top:16px;font-size:12px;color:#6B7280;line-height:1.6"><strong style="color:#374151">Notes:</strong><br>${sanitize(inv.notes).replace(/\n/g, '<br>')}</div>` : ''}
    ${inv.terms ? `<div style="background:#F9FAFB;padding:14px;border-radius:8px;margin-top:10px;font-size:12px;color:#6B7280;line-height:1.6"><strong style="color:#374151">Terms &amp; Conditions:</strong><br>${sanitize(inv.terms).replace(/\n/g, '<br>')}</div>` : ''}

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 24px;text-align:center;border-radius:0 0 10px 10px">
    <p style="font-size:12px;color:#9CA3AF;margin:0">Sent via <a href="https://send-bills.com" style="color:#0D9488;text-decoration:none">Send-Bills.com</a></p>
    <p style="font-size:11px;color:#D1D5DB;margin:8px 0 0">If you did not expect this invoice, you can safely ignore this email.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}


// ============================================================
// 1. SEND INVOICE EMAIL
// ============================================================
exports.sendInvoiceEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Verify auth
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' });

      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;

      const { invoiceId, recipientEmail } = req.body;
      if (!invoiceId || !recipientEmail) return res.status(400).json({ success: false, error: 'Missing invoiceId or recipientEmail' });

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) return res.status(400).json({ success: false, error: 'Invalid email format' });

      // Get invoice data
      const invDoc = await db.collection('users').doc(userId).collection('invoices').doc(invoiceId).get();
      if (!invDoc.exists) return res.status(404).json({ success: false, error: 'Invoice not found' });

      const inv = invDoc.data();
      const cur = inv.currency || '$';
      const appUrl = functions.config().app?.url || 'https://send-bills.com';
      const viewUrl = `${appUrl}/invoice-view.html?uid=${userId}&id=${invoiceId}`;
      const verifiedSender = functions.config().sendgrid?.verified_sender || 'invoices@send-bills.com';

      // Set up SendGrid
      sgMail.setApiKey(functions.config().sendgrid.key);

      const docType = inv.docType || 'Invoice';
      const fromName = inv.fromName || 'Send-Bills.com';

      const msg = {
        // --- SENDER IDENTITY (critical for deliverability) ---
        from: {
          email: verifiedSender,          // Must be verified in SendGrid
          name: fromName                  // Shows sender's business name
        },
        replyTo: {
          email: inv.fromEmail || verifiedSender,  // Replies go to the invoice sender
          name: fromName
        },

        to: recipientEmail,

        // --- SUBJECT (avoid spam trigger words) ---
        subject: `${docType} ${inv.num || ''} from ${fromName}`,

        // --- BOTH HTML AND PLAIN TEXT (critical for anti-spam) ---
        // Emails without plain text fallback are flagged as spam
        text: buildPlainText(inv, cur, viewUrl),
        html: buildHtmlEmail(inv, cur, viewUrl),

        // --- HEADERS (improve deliverability) ---
        headers: {
          // Unique message ID prevents duplicate detection issues
          'X-Entity-Ref-ID': `invoice-${invoiceId}-${Date.now()}`,
          // Precedence: bulk tells filters this is a transactional email
          'Precedence': 'bulk'
        },

        // --- SENDGRID SPECIFIC SETTINGS ---
        mailSettings: {
          // Disable click tracking (tracked links look spammy)
          clickTracking: { enable: false },
          // Disable open tracking (tracking pixels look spammy)
          openTracking: { enable: false }
        },

        // --- CATEGORIES (for SendGrid analytics) ---
        categories: ['invoice-email', docType.toLowerCase()],

        // --- CUSTOM ARGS (for tracking in SendGrid) ---
        customArgs: {
          invoiceId: invoiceId,
          userId: userId
        }
      };

      await sgMail.send(msg);

      // Update invoice status to Sent
      await db.collection('users').doc(userId).collection('invoices').doc(invoiceId).update({
        status: 'Sent',
        sentTo: recipientEmail,
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ success: true });
    } catch (err) {
      console.error('sendInvoiceEmail error:', err);
      // Parse SendGrid-specific errors
      if (err.response && err.response.body) {
        console.error('SendGrid error body:', JSON.stringify(err.response.body));
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  });
});


// ============================================================
// 2. CREATE STRIPE CHECKOUT SESSION
// ============================================================
exports.createStripeCheckout = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId, invoiceId } = req.body;
      if (!userId || !invoiceId) return res.status(400).json({ success: false, error: 'Missing params' });

      // Get invoice
      const invDoc = await db.collection('users').doc(userId).collection('invoices').doc(invoiceId).get();
      if (!invDoc.exists) return res.status(404).json({ success: false, error: 'Invoice not found' });
      const inv = invDoc.data();

      // Get user's Stripe key
      const settingsDoc = await db.collection('users').doc(userId).collection('settings').doc('payment').get();
      if (!settingsDoc.exists || !settingsDoc.data().stripeSecretKey) {
        return res.status(400).json({ success: false, error: 'Stripe not configured' });
      }

      const stripe = require('stripe')(settingsDoc.data().stripeSecretKey);
      const appUrl = functions.config().app?.url || 'https://send-bills.com';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: inv.currency === '$' ? 'usd' : inv.currency === '€' ? 'eur' : inv.currency === '£' ? 'gbp' : 'usd',
            product_data: {
              name: `${inv.docType || 'Invoice'} ${inv.num || ''}`,
              description: `From ${inv.fromName || 'Send-Bills.com'}`
            },
            unit_amount: Math.round((inv.grand || 0) * 100)
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${appUrl}/invoice-view.html?uid=${userId}&id=${invoiceId}&paid=true`,
        cancel_url: `${appUrl}/invoice-view.html?uid=${userId}&id=${invoiceId}`,
        metadata: { userId, invoiceId }
      });

      return res.json({ success: true, url: session.url });
    } catch (err) {
      console.error('createStripeCheckout error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
});


// ============================================================
// 3. STRIPE WEBHOOK (auto-mark invoice as Paid)
// ============================================================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, invoiceId } = session.metadata || {};

      if (userId && invoiceId) {
        await db.collection('users').doc(userId).collection('invoices').doc(invoiceId).update({
          status: 'Paid',
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          paidVia: 'Stripe',
          stripeSessionId: session.id
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('stripeWebhook error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ============================================================
// 4. RECURRING INVOICES — Runs daily via Cloud Scheduler
// ============================================================
// Deploy: firebase functions:config:set app.url="https://send-bills.com"
// Then set up Cloud Scheduler to call this daily, or use:
// exports.recurringCron = functions.pubsub.schedule('every 24 hours').onRun(...)

exports.processRecurringInvoices = functions.pubsub.schedule('every day 08:00')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const now = new Date().toISOString();
      // Get all users
      const usersSnap = await db.collection('users').get();

      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;
        const recurSnap = await db.collection('users').doc(userId)
          .collection('recurring')
          .where('active', '==', true)
          .get();

        for (const recurDoc of recurSnap.docs) {
          const recur = recurDoc.data();
          const nextRun = recur.nextRun;

          // Skip if not due yet
          if (!nextRun || nextRun > now) continue;

          const template = recur.invoiceTemplate;
          if (!template) continue;

          // Generate new invoice number
          const newNum = (template.docType || 'INV') + '-' + Math.floor(Math.random() * 9000 + 1000);
          const today = new Date();
          const dueDate = new Date();

          // Calculate due date based on original payment terms
          if (template.due && template.date) {
            const origDate = new Date(template.date);
            const origDue = new Date(template.due);
            const daysDiff = Math.round((origDue - origDate) / (1000 * 60 * 60 * 24));
            dueDate.setDate(today.getDate() + daysDiff);
          } else {
            dueDate.setDate(today.getDate() + 30);
          }

          // Create new invoice
          const newInvoice = {
            ...template,
            num: newNum,
            date: today.toISOString().split('T')[0],
            due: dueDate.toISOString().split('T')[0],
            status: 'Draft',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            recurringId: recurDoc.id,
            autoGenerated: true
          };

          const invRef = await db.collection('users').doc(userId)
            .collection('invoices').add(newInvoice);

          // Auto-send if enabled
          if (recur.autoSend && template.toEmail) {
            const appUrl = functions.config().app?.url || 'https://send-bills.com';
            const viewUrl = `${appUrl}/invoice-view.html?uid=${userId}&id=${invRef.id}`;
            const cur = template.currency || '$';

            sgMail.setApiKey(functions.config().sendgrid.key);
            const verifiedSender = functions.config().sendgrid?.verified_sender || 'invoices@send-bills.com';

            await sgMail.send({
              from: { email: verifiedSender, name: template.fromName || 'Send-Bills.com' },
              replyTo: { email: template.fromEmail || verifiedSender, name: template.fromName || '' },
              to: template.toEmail,
              subject: `${template.docType || 'Invoice'} ${newNum} from ${template.fromName || 'Send-Bills.com'}`,
              text: buildPlainText(newInvoice, cur, viewUrl),
              html: buildHtmlEmail(newInvoice, cur, viewUrl),
              mailSettings: { clickTracking: { enable: false }, openTracking: { enable: false } }
            });

            await invRef.update({ status: 'Sent', sentTo: template.toEmail, sentAt: admin.firestore.FieldValue.serverTimestamp() });
          }

          // Calculate next run
          const freq = recur.frequency || 'monthly';
          const next = new Date(nextRun);
          if (freq === 'weekly') next.setDate(next.getDate() + 7);
          else if (freq === 'biweekly') next.setDate(next.getDate() + 14);
          else if (freq === 'monthly') next.setMonth(next.getMonth() + 1);
          else if (freq === 'quarterly') next.setMonth(next.getMonth() + 3);
          else if (freq === 'yearly') next.setFullYear(next.getFullYear() + 1);

          await recurDoc.ref.update({
            lastGenerated: admin.firestore.FieldValue.serverTimestamp(),
            nextRun: next.toISOString()
          });

          console.log(`Generated recurring invoice ${newNum} for user ${userId}`);
        }
      }
    } catch (err) {
      console.error('processRecurringInvoices error:', err);
    }
  });


// ============================================================
// 5. AUTOMATIC PAYMENT REMINDERS — Runs daily
// ============================================================
// Sends escalating reminders for overdue invoices:
// Day 1 overdue: Friendly reminder
// Day 7 overdue: Second notice
// Day 14 overdue: Final reminder
// Day 30 overdue: Urgent notice

exports.sendPaymentReminders = functions.pubsub.schedule('every day 10:00')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const usersSnap = await db.collection('users').get();

      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;

        // Check if user has reminders enabled
        const settingsDoc = await db.collection('users').doc(userId)
          .collection('settings').doc('reminders').get();
        const settings = settingsDoc.exists ? settingsDoc.data() : null;
        if (!settings || !settings.enabled) continue;

        const reminderDays = settings.reminderDays || [1, 7, 14, 30];
        const beforeDueDays = settings.beforeDueDays || [5];
        const customSubjectBefore = settings.subjectBefore || '';
        const customMsgBefore = settings.msgBefore || '';
        const customSubjectOverdue = settings.subjectOverdue || '';
        const customMsgOverdue = settings.msgOverdue || '';

        // Get unpaid sent invoices
        const invSnap = await db.collection('users').doc(userId)
          .collection('invoices')
          .where('status', 'in', ['Sent', 'Draft'])
          .get();

        for (const invDoc of invSnap.docs) {
          const inv = invDoc.data();
          if (!inv.due || !inv.toEmail) continue;

          const dueDate = new Date(inv.due);
          const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
          const daysOverdue = -daysUntilDue; // positive = overdue, negative = before due

          // ===== BEFORE-DUE REMINDERS =====
          if (daysUntilDue >= 0 && beforeDueDays.includes(daysUntilDue)) {
            const lastBeforeReminder = inv.lastBeforeReminderDay;
            if (lastBeforeReminder !== daysUntilDue) {
              const cur = inv.currency || '$';
              const appUrl = functions.config().app?.url || 'https://send-bills.com';
              const viewUrl = `${appUrl}/invoice-view.html?uid=${userId}&id=${invDoc.id}`;
              const verifiedSender = functions.config().sendgrid?.verified_sender || 'invoices@send-bills.com';

              // Apply custom content with placeholders
              const replacePlaceholders = (str, inv, extra) => {
                return str.replace(/\{invoice_num\}/g, inv.num || '')
                  .replace(/\{company\}/g, inv.fromName || '')
                  .replace(/\{amount\}/g, cur + (inv.grand || 0).toFixed(2))
                  .replace(/\{due_date\}/g, inv.due || '')
                  .replace(/\{client_name\}/g, inv.toName || '')
                  .replace(/\{days_until_due\}/g, daysUntilDue)
                  .replace(/\{days_overdue\}/g, extra?.daysOverdue || 0);
              };

              const subj = customSubjectBefore
                ? replacePlaceholders(customSubjectBefore, inv)
                : `Upcoming payment: ${inv.docType || 'Invoice'} ${inv.num} due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
              const msg = customMsgBefore
                ? replacePlaceholders(customMsgBefore, inv)
                : `Hi ${inv.toName || ''}, this is a friendly reminder that ${inv.docType || 'Invoice'} ${inv.num} for ${cur}${(inv.grand || 0).toFixed(2)} is due on ${inv.due}${daysUntilDue === 0 ? ' (today)' : ` (in ${daysUntilDue} days)`}. Please arrange payment at your convenience. Thank you!`;

              sgMail.setApiKey(functions.config().sendgrid.key);
              await sgMail.send({
                from: { email: verifiedSender, name: inv.fromName || 'Send-Bills.com' },
                replyTo: { email: inv.fromEmail || verifiedSender, name: inv.fromName || '' },
                to: inv.toEmail, subject: subj,
                text: msg + `\n\nView and pay: ${viewUrl}\n\n---\nSent via Send-Bills.com`,
                html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8FAFB;padding:24px">
                  <div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB">
                    <div style="background:#0D9488;padding:20px;text-align:center"><h2 style="color:#fff;margin:0;font-size:18px">Upcoming Payment Reminder</h2></div>
                    <div style="padding:24px">
                      <p style="color:#374151;font-size:14px;line-height:1.6">${sanitize(msg)}</p>
                      <div style="background:#F0FDFA;border-radius:10px;padding:20px;text-align:center;margin:20px 0">
                        <div style="color:#6B7280;font-size:12px">Amount Due</div>
                        <div style="color:#0D9488;font-size:28px;font-weight:900">${cur}${(inv.grand || 0).toFixed(2)}</div>
                        <div style="color:#0D9488;font-size:12px;margin-top:4px;font-weight:600">${daysUntilDue === 0 ? 'Due Today' : `Due in ${daysUntilDue} days`}</div>
                      </div>
                      <div style="text-align:center"><a href="${viewUrl}" style="background:#0D9488;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">View &amp; Pay Invoice</a></div>
                    </div>
                  </div>
                </body></html>`,
                mailSettings: { clickTracking: { enable: false }, openTracking: { enable: false } }
              });
              await invDoc.ref.update({ lastBeforeReminderDay: daysUntilDue, lastBeforeReminderSent: admin.firestore.FieldValue.serverTimestamp() });
              console.log(`Sent before-due reminder for ${inv.num} (${daysUntilDue} days until due)`);
            }
            continue; // Don't send overdue reminders for invoices not yet due
          }

          if (daysOverdue <= 0) continue; // Not overdue yet

          // Check if this overdue reminder day matches
          if (!reminderDays.includes(daysOverdue)) continue;

          // Check if we already sent a reminder for this interval
          const lastReminderDay = inv.lastReminderDay || 0;
          if (daysOverdue <= lastReminderDay) continue;

          // Determine reminder tone
          let reminderType, subject, greeting;
          if (daysOverdue <= 3) {
            reminderType = 'friendly';
            subject = `Friendly Reminder: ${inv.docType || 'Invoice'} ${inv.num} is due`;
            greeting = `This is a friendly reminder that ${inv.docType || 'Invoice'} ${inv.num} was due on ${inv.due}. If you've already sent the payment, please disregard this message.`;
          } else if (daysOverdue <= 10) {
            reminderType = 'second';
            subject = `Second Notice: ${inv.docType || 'Invoice'} ${inv.num} is ${daysOverdue} days overdue`;
            greeting = `This is a second notice regarding ${inv.docType || 'Invoice'} ${inv.num} which was due on ${inv.due} and is now ${daysOverdue} days overdue. Please arrange payment at your earliest convenience.`;
          } else if (daysOverdue <= 21) {
            reminderType = 'final';
            subject = `Final Reminder: ${inv.docType || 'Invoice'} ${inv.num} — ${daysOverdue} days overdue`;
            greeting = `This is a final reminder for ${inv.docType || 'Invoice'} ${inv.num} which is now ${daysOverdue} days past due. We kindly request immediate payment to avoid any further action.`;
          } else {
            reminderType = 'urgent';
            subject = `Urgent: ${inv.docType || 'Invoice'} ${inv.num} — ${daysOverdue} days overdue`;
            greeting = `${inv.docType || 'Invoice'} ${inv.num} has been outstanding for ${daysOverdue} days. This requires immediate attention. Please process the payment as soon as possible.`;
          }

          // Apply custom overdue content if set
          const cur = inv.currency || '$';
          if (customSubjectOverdue) {
            subject = customSubjectOverdue.replace(/\{invoice_num\}/g, inv.num || '').replace(/\{company\}/g, inv.fromName || '').replace(/\{amount\}/g, cur + (inv.grand || 0).toFixed(2)).replace(/\{due_date\}/g, inv.due || '').replace(/\{client_name\}/g, inv.toName || '').replace(/\{days_overdue\}/g, daysOverdue);
          }
          if (customMsgOverdue) {
            greeting = customMsgOverdue.replace(/\{invoice_num\}/g, inv.num || '').replace(/\{company\}/g, inv.fromName || '').replace(/\{amount\}/g, cur + (inv.grand || 0).toFixed(2)).replace(/\{due_date\}/g, inv.due || '').replace(/\{client_name\}/g, inv.toName || '').replace(/\{days_overdue\}/g, daysOverdue);
          }

          const appUrl = functions.config().app?.url || 'https://send-bills.com';
          const viewUrl = `${appUrl}/invoice-view.html?uid=${userId}&id=${invDoc.id}`;
          const verifiedSender = functions.config().sendgrid?.verified_sender || 'invoices@send-bills.com';

          sgMail.setApiKey(functions.config().sendgrid.key);

          await sgMail.send({
            from: { email: verifiedSender, name: inv.fromName || 'Send-Bills.com' },
            replyTo: { email: inv.fromEmail || verifiedSender, name: inv.fromName || '' },
            to: inv.toEmail,
            subject,
            text: `${greeting}\n\nAmount Due: ${cur}${(inv.grand || 0).toFixed(2)}\nOriginal Due Date: ${inv.due}\n\nView and pay: ${viewUrl}\n\n---\nSent via Send-Bills.com`,
            html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8FAFB;padding:24px">
              <div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB">
                <div style="background:${reminderType==='urgent'?'#EF4444':reminderType==='final'?'#D97706':'#0D9488'};padding:20px;text-align:center">
                  <h2 style="color:#fff;margin:0;font-size:18px">${reminderType === 'friendly' ? 'Payment Reminder' : reminderType === 'second' ? 'Second Payment Notice' : reminderType === 'final' ? 'Final Payment Reminder' : 'Urgent Payment Notice'}</h2>
                </div>
                <div style="padding:24px">
                  <p style="color:#374151;font-size:14px;line-height:1.6">${greeting}</p>
                  <div style="background:#F0FDFA;border-radius:10px;padding:20px;text-align:center;margin:20px 0">
                    <div style="color:#6B7280;font-size:12px">Amount Due</div>
                    <div style="color:#0D9488;font-size:28px;font-weight:900">${cur}${(inv.grand || 0).toFixed(2)}</div>
                    <div style="color:#EF4444;font-size:12px;margin-top:4px;font-weight:600">${daysOverdue} days overdue</div>
                  </div>
                  <div style="text-align:center;margin:20px 0">
                    <a href="${viewUrl}" style="background:#0D9488;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">View &amp; Pay Invoice</a>
                  </div>
                </div>
              </div>
              <div style="text-align:center;padding:16px;font-size:11px;color:#9CA3AF">Sent via <a href="https://send-bills.com" style="color:#0D9488">Send-Bills.com</a></div>
            </body></html>`,
            mailSettings: { clickTracking: { enable: false }, openTracking: { enable: false } }
          });

          // Update invoice with reminder tracking
          await invDoc.ref.update({
            lastReminderDay: daysOverdue,
            lastReminderSent: admin.firestore.FieldValue.serverTimestamp(),
            reminderCount: (inv.reminderCount || 0) + 1
          });

          console.log(`Sent ${reminderType} reminder for invoice ${inv.num} to ${inv.toEmail} (${daysOverdue} days overdue)`);
        }
      }
    } catch (err) {
      console.error('sendPaymentReminders error:', err);
    }
  });


// ============================================================
// 6. SEND PAYMENT RECEIPT / THANK YOU EMAIL
// ============================================================
// Called automatically when an invoice is marked as Paid
// Sends a receipt to the client with customizable content

exports.sendPaymentReceipt = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' });

      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;

      const { invoiceId } = req.body;
      if (!invoiceId) return res.status(400).json({ success: false, error: 'Missing invoiceId' });

      const invDoc = await db.collection('users').doc(userId).collection('invoices').doc(invoiceId).get();
      if (!invDoc.exists) return res.status(404).json({ success: false, error: 'Invoice not found' });
      const inv = invDoc.data();

      if (!inv.toEmail) return res.status(400).json({ success: false, error: 'No client email' });

      // Get receipt customization settings
      const receiptDoc = await db.collection('users').doc(userId).collection('settings').doc('receipt').get();
      const receipt = receiptDoc.exists ? receiptDoc.data() : {};

      const cur = inv.currency || '$';
      const companyName = receipt.companyName || inv.fromName || 'Send-Bills.com';
      const statementName = receipt.statementName || companyName;
      const thankYouMessage = receipt.thankYouMessage || `Thank you for your payment! We appreciate your business.`;
      const receiptNote = receipt.receiptNote || '';
      const verifiedSender = functions.config().sendgrid?.verified_sender || 'invoices@send-bills.com';
      const appUrl = functions.config().app?.url || 'https://send-bills.com';
      const viewUrl = `${appUrl}/invoice-view.html?uid=${userId}&id=${invoiceId}`;

      sgMail.setApiKey(functions.config().sendgrid.key);

      const paidDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const receiptNum = 'RCP-' + invoiceId.slice(-6).toUpperCase();

      // Items summary
      let itemsSummary = '';
      if (inv.items && inv.items.length > 0) {
        itemsSummary = inv.items.map(it =>
          `${sanitize(it.name || 'Item')} (x${it.qty || 1}) — ${cur}${(it.total || 0).toFixed(2)}`
        ).join('\n');
      }

      const plainText = `PAYMENT RECEIPT\n${'='.repeat(40)}\n\nReceipt #: ${receiptNum}\nDate: ${paidDate}\nFrom: ${companyName}\n\n${thankYouMessage}\n\nPayment Details:\n- ${inv.docType || 'Invoice'} #: ${inv.num}\n- Amount Paid: ${cur}${(inv.grand || 0).toFixed(2)}\n- Payment Date: ${paidDate}\n- Statement Name: ${statementName}\n\nItems:\n${itemsSummary}\n\n${receiptNote ? 'Note: ' + receiptNote + '\n\n' : ''}View receipt online: ${viewUrl}\n\n---\nSent via Send-Bills.com`;

      const htmlEmail = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8FAFB;padding:24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
  <tr><td style="background:#065F46;padding:24px;text-align:center;border-radius:10px 10px 0 0">
    ${receipt.logoUrl ? `<img src="${receipt.logoUrl}" style="max-height:40px;margin-bottom:8px" alt="">` : ''}
    <h1 style="color:#fff;margin:0;font-size:20px">Payment Receipt</h1>
    <p style="color:#A7F3D0;margin:4px 0 0;font-size:13px">from ${sanitize(companyName)}</p>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 24px;border:1px solid #E5E7EB;border-top:none">
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:56px;height:56px;border-radius:50%;background:#D1FAE5;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:28px">&#10003;</div>
      <h2 style="color:#065F46;margin:0 0 6px;font-size:18px">Payment Received!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0">${sanitize(thankYouMessage)}</p>
    </div>
    <div style="background:#F0FDFA;border-radius:10px;padding:20px;margin:20px 0">
      <table style="width:100%;font-size:13px;color:#374151" cellpadding="4" cellspacing="0">
        <tr><td style="color:#6B7280;width:140px">Receipt #</td><td style="font-weight:700">${receiptNum}</td></tr>
        <tr><td style="color:#6B7280">${inv.docType || 'Invoice'} #</td><td>${sanitize(inv.num || '')}</td></tr>
        <tr><td style="color:#6B7280">Payment Date</td><td>${paidDate}</td></tr>
        <tr><td style="color:#6B7280">Amount Paid</td><td style="font-size:18px;font-weight:900;color:#065F46">${cur}${(inv.grand || 0).toFixed(2)}</td></tr>
        <tr><td style="color:#6B7280">Statement Name</td><td>${sanitize(statementName)}</td></tr>
      </table>
    </div>
    ${inv.items && inv.items.length > 0 ? `
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr style="background:#F9FAFB"><th style="text-align:left;padding:8px;font-size:11px;color:#6B7280;font-weight:700">Item</th><th style="text-align:right;padding:8px;font-size:11px;color:#6B7280;font-weight:700">Amount</th></tr>
      ${inv.items.map(it => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #F3F4F6">${sanitize(it.name || 'Item')} x${it.qty || 1}</td><td style="padding:8px;font-size:13px;text-align:right;border-bottom:1px solid #F3F4F6;font-weight:600">${cur}${(it.total || 0).toFixed(2)}</td></tr>`).join('')}
      <tr><td style="padding:8px;font-size:13px;color:#6B7280">Subtotal</td><td style="padding:8px;text-align:right;font-size:13px">${cur}${(inv.sub || 0).toFixed(2)}</td></tr>
      <tr><td style="padding:8px;font-size:13px;color:#6B7280">Tax (${inv.taxRate || 0}%)</td><td style="padding:8px;text-align:right;font-size:13px">${cur}${(inv.taxAmt || 0).toFixed(2)}</td></tr>
      <tr style="border-top:2px solid #065F46"><td style="padding:10px 8px;font-size:15px;font-weight:800;color:#065F46">Total Paid</td><td style="padding:10px 8px;text-align:right;font-size:15px;font-weight:800;color:#065F46">${cur}${(inv.grand || 0).toFixed(2)}</td></tr>
    </table>` : ''}
    ${receiptNote ? `<div style="background:#F9FAFB;padding:12px;border-radius:8px;font-size:12px;color:#6B7280;margin-top:12px"><strong style="color:#374151">Note:</strong> ${sanitize(receiptNote)}</div>` : ''}
    <div style="text-align:center;margin:24px 0">
      <a href="${viewUrl}" style="background:#065F46;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">View Receipt Online</a>
    </div>
  </td></tr>
  <tr><td style="padding:16px;text-align:center;font-size:11px;color:#9CA3AF;border-radius:0 0 10px 10px">
    <p style="margin:0">Sent via <a href="https://send-bills.com" style="color:#0D9488;text-decoration:none">Send-Bills.com</a></p>
  </td></tr>
</table></body></html>`;

      await sgMail.send({
        from: { email: verifiedSender, name: companyName },
        replyTo: { email: inv.fromEmail || verifiedSender, name: companyName },
        to: inv.toEmail,
        subject: `Payment Receipt from ${companyName} — ${cur}${(inv.grand || 0).toFixed(2)}`,
        text: plainText,
        html: htmlEmail,
        headers: { 'X-Entity-Ref-ID': `receipt-${invoiceId}-${Date.now()}` },
        mailSettings: { clickTracking: { enable: false }, openTracking: { enable: false } }
      });

      // Update invoice with receipt sent flag
      await invDoc.ref.update({
        receiptSent: true,
        receiptSentAt: admin.firestore.FieldValue.serverTimestamp(),
        receiptNum: receiptNum
      });

      return res.json({ success: true, receiptNum });
    } catch (err) {
      console.error('sendPaymentReceipt error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
});
