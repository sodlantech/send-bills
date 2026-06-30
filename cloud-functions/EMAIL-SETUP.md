# Email Deliverability Setup — Send-Bills.com
# Ensuring invoice emails reach the inbox, not spam

## Why Emails Go to Spam

Email providers (Gmail, Outlook, Yahoo) check 3 things:
1. **Is the sender who they claim to be?** (SPF + DKIM)
2. **Has the domain owner set a policy?** (DMARC)
3. **Does the email look legitimate?** (Content, headers, reputation)

We handle #3 in the code. You need to set up #1 and #2 via DNS.

---

## Step 1: SendGrid Account Setup

1. Go to [sendgrid.com](https://sendgrid.com) > Create free account
2. **Verify your domain** (NOT just a single sender):
   - Go to Settings > Sender Authentication > **Authenticate Your Domain**
   - Enter `send-bills.com`
   - SendGrid gives you DNS records to add (this sets up DKIM automatically)
3. Create an API key:
   - Go to Settings > API Keys > Create API Key
   - Select "Restricted Access" > enable only "Mail Send"
   - Copy the key (starts with `SG.`)

> **IMPORTANT**: Domain authentication is the single most important step.
> Single sender verification alone will NOT prevent spam.

---

## Step 2: DNS Records (Add to your domain registrar)

Add these DNS records for `send-bills.com`:

### SPF Record (Sender Policy Framework)
Tells email providers "SendGrid is allowed to send emails on behalf of send-bills.com"

```
Type: TXT
Host: @
Value: v=spf1 include:sendgrid.net ~all
```

### DKIM Records (DomainKeys Identified Mail)
SendGrid provides these automatically when you authenticate your domain.
They look like:

```
Type: CNAME
Host: s1._domainkey
Value: s1.domainkey.u12345.wl.sendgrid.net

Type: CNAME
Host: s2._domainkey
Value: s2.domainkey.u12345.wl.sendgrid.net
```

> You'll get the exact values from SendGrid during domain authentication.

### DMARC Record (Domain-based Message Authentication)
Tells email providers what to do if SPF/DKIM fails:

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@send-bills.com; pct=100
```

**Start with `p=none` first** (monitoring only), then move to `p=quarantine` after confirming emails are passing:

```
# Phase 1 (first 2 weeks):
v=DMARC1; p=none; rua=mailto:dmarc@send-bills.com; pct=100

# Phase 2 (after confirming delivery):
v=DMARC1; p=quarantine; rua=mailto:dmarc@send-bills.com; pct=100
```

### Return Path / Bounce Handling (Optional but recommended)
```
Type: CNAME
Host: em
Value: u12345.wl.sendgrid.net
```

> SendGrid provides this during domain authentication.

---

## Step 3: Firebase Config

```bash
# Your SendGrid API key
firebase functions:config:set sendgrid.key="SG.your_api_key_here"

# The verified sender email (must match your authenticated domain)
firebase functions:config:set sendgrid.verified_sender="invoices@send-bills.com"

# Your domain URL
firebase functions:config:set app.url="https://send-bills.com"
```

---

## Step 4: Verify Everything Works

### Test DNS Records
Use these free tools to verify your DNS is correct:

- **MXToolbox**: [mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)
  - Check SPF: enter `send-bills.com` > SPF Record Lookup
  - Check DKIM: enter `s1._domainkey.send-bills.com` > DKIM Lookup
  - Check DMARC: enter `send-bills.com` > DMARC Lookup

- **Google Admin Toolbox**: [toolbox.googleapps.com/apps/checkmx](https://toolbox.googleapps.com/apps/checkmx/)

- **Mail-tester**: [mail-tester.com](https://www.mail-tester.com) - Send a test email and get a spam score (aim for 9/10 or 10/10)

### SendGrid Dashboard
After sending your first few emails, check:
- Settings > Sender Authentication > should show green checkmarks
- Activity > should show "Delivered" not "Bounced" or "Blocked"

---

## What We Already Handle in Code

These anti-spam best practices are built into `index.js`:

| Practice | Status | Details |
|---|---|---|
| Plain text + HTML versions | Done | Both versions included in every email |
| Reply-To header | Done | Replies go to invoice sender's email |
| No click tracking | Done | Disabled - tracked URLs trigger spam filters |
| No open tracking | Done | Disabled - tracking pixels trigger spam filters |
| Unique Message-ID | Done | Prevents duplicate flagging |
| Proper HTML structure | Done | Table-based layout, inline CSS, valid HTML5 |
| Sanitized user input | Done | XSS prevention in email content |
| No spammy subject lines | Done | Clean format: "Invoice INV-1234 from Business Name" |
| Proper From/Reply-To | Done | From = verified domain, Reply-To = user's email |
| No URL shorteners | Done | Direct links only |
| Low image-to-text ratio | Done | Minimal images, mostly text |

---

## Troubleshooting

### Emails going to Gmail Spam
1. Check if SPF, DKIM, DMARC all pass: Open the email in Gmail > "..." > "Show original" > look for `spf=pass`, `dkim=pass`, `dmarc=pass`
2. If SPF fails: Your SPF DNS record is wrong or not propagated yet (wait 24-48h)
3. If DKIM fails: Domain authentication in SendGrid is incomplete

### Emails going to Outlook/Hotmail Spam
1. Outlook is stricter. Make sure DMARC is set to at least `p=quarantine`
2. Send from a consistent volume (don't blast 1000 emails on day 1)
3. Apply for [SNDS](https://sendersupport.olc.protection.outlook.com/snds/) (Smart Network Data Services)

### Emails not delivered at all
1. Check SendGrid Activity Feed for bounces
2. Verify recipient email is valid
3. Check if your SendGrid account is in review (new accounts may have sending limits)

### Building Sender Reputation
- Start with low volume (10-50 emails/day for the first week)
- Gradually increase over 2-4 weeks
- Keep bounce rate below 2%
- This is called "IP warming" - SendGrid does this automatically on shared IPs

---

## Summary Checklist

- [ ] SendGrid account created
- [ ] Domain authenticated in SendGrid (not just single sender)
- [ ] SPF record added to DNS
- [ ] DKIM records added to DNS (from SendGrid)
- [ ] DMARC record added to DNS
- [ ] Firebase config set with SendGrid key and verified sender
- [ ] Cloud Functions deployed
- [ ] Test email sent and checked with mail-tester.com (score 9+/10)
- [ ] Checked email in Gmail "Show original" - SPF/DKIM/DMARC all pass
