// ============================================================
// FIREBASE CONFIGURATION — Send-Bills.com
// ============================================================
//
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g., "SendBills")
// 3. Enable Authentication → Sign-in method → Google
// 4. Enable Cloud Firestore → Create database → Start in production mode
// 5. Copy your Firebase config below
// 6. Set up Firestore Security Rules (see bottom of this file)
//
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (gracefully handle missing config)
let auth = null;
let db = null;
let googleProvider = null;
let firebaseReady = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    googleProvider = new firebase.auth.GoogleAuthProvider();
    firebaseReady = true;
  } else {
    console.warn('Firebase not configured yet. Invoice history & Google sign-in disabled. Update firebase-config.js with your project credentials.');
  }
} catch(e) {
  console.warn('Firebase init failed:', e.message);
}

// ============================================================
// AUTH FUNCTIONS
// ============================================================

let currentUser = null;

if (auth) {
  auth.onAuthStateChanged(user => {
    currentUser = user;
    updateAuthUI();
  });
}

function signInWithGoogle() {
  if (!firebaseReady) { alert('Google Sign-In is not configured yet. Please set up Firebase in firebase-config.js'); return Promise.reject('Not configured'); }
  return auth.signInWithPopup(googleProvider);
}

function signOutUser() {
  if (!auth) return Promise.resolve();
  return auth.signOut();
}

function updateAuthUI() {
  const loginBtn = document.getElementById('navLoginBtn');
  const userMenu = document.getElementById('navUserMenu');
  const userName = document.getElementById('navUserName');
  const userAvatar = document.getElementById('navUserAvatar');
  const historyLink = document.getElementById('navHistoryLink');

  if (!loginBtn || !userMenu) return;

  if (currentUser) {
    loginBtn.style.display = 'none';
    userMenu.style.display = 'flex';
    if (userName) userName.textContent = currentUser.displayName || 'User';
    if (userAvatar) userAvatar.src = currentUser.photoURL || '';
    if (historyLink) historyLink.style.display = 'inline-flex';
  } else {
    loginBtn.style.display = 'inline-flex';
    userMenu.style.display = 'none';
    if (historyLink) historyLink.style.display = 'none';
  }
}

// ============================================================
// FIRESTORE — SAVE / LOAD INVOICES
// ============================================================

async function saveInvoiceToFirestore(invoiceData) {
  if (!firebaseReady || !currentUser) return null;
  try {
    const docRef = await db.collection('users').doc(currentUser.uid)
      .collection('invoices').add({
        ...invoiceData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userEmail: currentUser.email,
        userName: currentUser.displayName
      });
    return docRef.id;
  } catch (err) {
    console.error('Error saving invoice:', err);
    return null;
  }
}

async function getInvoiceHistory() {
  if (!firebaseReady || !currentUser) return [];
  try {
    const snap = await db.collection('users').doc(currentUser.uid)
      .collection('invoices')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error loading invoices:', err);
    return [];
  }
}

async function deleteInvoiceFromFirestore(invoiceId) {
  if (!firebaseReady || !currentUser) return false;
  try {
    await db.collection('users').doc(currentUser.uid)
      .collection('invoices').doc(invoiceId).delete();
    return true;
  } catch (err) {
    console.error('Error deleting invoice:', err);
    return false;
  }
}

async function getInvoiceById(invoiceId) {
  if (!firebaseReady || !currentUser) return null;
  try {
    const doc = await db.collection('users').doc(currentUser.uid)
      .collection('invoices').doc(invoiceId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (err) {
    console.error('Error loading invoice:', err);
    return null;
  }
}


// ============================================================
// INVOICE STATUS MANAGEMENT
// ============================================================
// Statuses: Draft, Sent, Paid, Voided, Cancelled

async function updateInvoiceStatus(invoiceId, status, reason) {
  if (!firebaseReady || !currentUser) return false;
  try {
    const update = {
      status: status,
      statusUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (reason) update.statusReason = reason;
    if (status === 'Paid') update.paidAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(currentUser.uid)
      .collection('invoices').doc(invoiceId).update(update);
    return true;
  } catch (err) {
    console.error('Error updating invoice status:', err);
    return false;
  }
}

// ============================================================
// PAYMENT SETTINGS (Stripe / PayPal)
// ============================================================

async function savePaymentSettings(settings) {
  if (!firebaseReady || !currentUser) return false;
  try {
    await db.collection('users').doc(currentUser.uid)
      .collection('settings').doc('payment').set(settings, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving payment settings:', err);
    return false;
  }
}

async function getPaymentSettings() {
  if (!firebaseReady || !currentUser) return null;
  try {
    const doc = await db.collection('users').doc(currentUser.uid)
      .collection('settings').doc('payment').get();
    return doc.exists ? doc.data() : null;
  } catch (err) {
    console.error('Error loading payment settings:', err);
    return null;
  }
}

// ============================================================
// SEND INVOICE VIA EMAIL (calls Firebase Cloud Function)
// ============================================================

async function sendInvoiceEmail(invoiceId, recipientEmail) {
  if (!firebaseReady || !currentUser) return { success: false, error: 'Not authenticated' };
  try {
    const token = await currentUser.getIdToken();
    const res = await fetch(`https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/sendInvoiceEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ invoiceId, recipientEmail })
    });
    const data = await res.json();
    if (data.success) {
      await updateInvoiceStatus(invoiceId, 'Sent');
    }
    return data;
  } catch (err) {
    console.error('Error sending invoice:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================
// PUBLIC INVOICE ACCESS (for shareable links)
// ============================================================

async function getPublicInvoice(userId, invoiceId) {
  if (!firebaseReady) return null;
  try {
    const doc = await db.collection('users').doc(userId)
      .collection('invoices').doc(invoiceId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (err) {
    console.error('Error loading public invoice:', err);
    return null;
  }
}

async function getPublicPaymentSettings(userId) {
  if (!firebaseReady) return null;
  try {
    const doc = await db.collection('users').doc(userId)
      .collection('settings').doc('payment').get();
    return doc.exists ? doc.data() : null;
  } catch (err) {
    return null;
  }
}

// ============================================================
// SAVED CLIENTS
// ============================================================

async function saveClient(clientData) {
  if (!firebaseReady || !currentUser) return null;
  try {
    if (clientData.id) {
      await db.collection('users').doc(currentUser.uid).collection('clients').doc(clientData.id).set(clientData, { merge: true });
      return clientData.id;
    }
    const ref = await db.collection('users').doc(currentUser.uid).collection('clients').add({
      ...clientData, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  } catch (e) { console.error('saveClient:', e); return null; }
}

async function getClients() {
  if (!firebaseReady || !currentUser) return [];
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('clients').orderBy('name').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error('getClients:', e); return []; }
}

async function deleteClient(id) {
  if (!firebaseReady || !currentUser) return false;
  try { await db.collection('users').doc(currentUser.uid).collection('clients').doc(id).delete(); return true; }
  catch (e) { return false; }
}

// ============================================================
// SAVED ITEMS / SERVICES
// ============================================================

async function saveItem(itemData) {
  if (!firebaseReady || !currentUser) return null;
  try {
    if (itemData.id) {
      await db.collection('users').doc(currentUser.uid).collection('savedItems').doc(itemData.id).set(itemData, { merge: true });
      return itemData.id;
    }
    const ref = await db.collection('users').doc(currentUser.uid).collection('savedItems').add({
      ...itemData, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  } catch (e) { console.error('saveItem:', e); return null; }
}

async function getSavedItems() {
  if (!firebaseReady || !currentUser) return [];
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('savedItems').orderBy('name').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error('getSavedItems:', e); return []; }
}

async function deleteSavedItem(id) {
  if (!firebaseReady || !currentUser) return false;
  try { await db.collection('users').doc(currentUser.uid).collection('savedItems').doc(id).delete(); return true; }
  catch (e) { return false; }
}

// ============================================================
// RECURRING INVOICES
// ============================================================

async function saveRecurringInvoice(data) {
  if (!firebaseReady || !currentUser) return null;
  try {
    if (data.id) {
      await db.collection('users').doc(currentUser.uid).collection('recurring').doc(data.id).set(data, { merge: true });
      return data.id;
    }
    const ref = await db.collection('users').doc(currentUser.uid).collection('recurring').add({
      ...data, active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastGenerated: null, nextRun: data.nextRun || null
    });
    return ref.id;
  } catch (e) { console.error('saveRecurring:', e); return null; }
}

async function getRecurringInvoices() {
  if (!firebaseReady || !currentUser) return [];
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('recurring').orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error('getRecurring:', e); return []; }
}

async function deleteRecurringInvoice(id) {
  if (!firebaseReady || !currentUser) return false;
  try { await db.collection('users').doc(currentUser.uid).collection('recurring').doc(id).delete(); return true; }
  catch (e) { return false; }
}

async function toggleRecurring(id, active) {
  if (!firebaseReady || !currentUser) return false;
  try {
    await db.collection('users').doc(currentUser.uid).collection('recurring').doc(id).update({ active });
    return true;
  } catch (e) { return false; }
}

// ============================================================
// PAYMENT REMINDER SETTINGS
// ============================================================

async function saveReminderSettings(settings) {
  if (!firebaseReady || !currentUser) return false;
  try {
    await db.collection('users').doc(currentUser.uid).collection('settings').doc('reminders').set(settings, { merge: true });
    return true;
  } catch (e) { return false; }
}

async function getReminderSettings() {
  if (!firebaseReady || !currentUser) return null;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).collection('settings').doc('reminders').get();
    return doc.exists ? doc.data() : null;
  } catch (e) { return null; }
}

// ============================================================
// RECEIPT CUSTOMIZATION SETTINGS
// ============================================================

async function saveReceiptSettings(settings) {
  if (!firebaseReady || !currentUser) return false;
  try {
    await db.collection('users').doc(currentUser.uid).collection('settings').doc('receipt').set(settings, { merge: true });
    return true;
  } catch (e) { return false; }
}

async function getReceiptSettings() {
  if (!firebaseReady || !currentUser) return null;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).collection('settings').doc('receipt').get();
    return doc.exists ? doc.data() : null;
  } catch (e) { return null; }
}

// ============================================================
// SEND RECEIPT (calls Cloud Function)
// ============================================================

async function sendPaymentReceiptEmail(invoiceId) {
  if (!firebaseReady || !currentUser) return { success: false, error: 'Not authenticated' };
  try {
    const token = await currentUser.getIdToken();
    const res = await fetch(`https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/sendPaymentReceipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ invoiceId })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ============================================================
// FIRESTORE SECURITY RULES (paste in Firebase Console)
// ============================================================
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     // User's own invoices — full access
//     match /users/{userId}/invoices/{invoiceId} {
//       allow read, write, delete: if request.auth != null
//                                   && request.auth.uid == userId;
//       // Public read for shareable invoice links
//       allow read: if true;
//     }
//     // User's settings (payment, reminders, etc.)
//     match /users/{userId}/settings/{settingId} {
//       allow read, write: if request.auth != null
//                           && request.auth.uid == userId;
//       allow read: if true;
//     }
//     // Saved clients
//     match /users/{userId}/clients/{clientId} {
//       allow read, write, delete: if request.auth != null
//                                   && request.auth.uid == userId;
//     }
//     // Saved items/services
//     match /users/{userId}/savedItems/{itemId} {
//       allow read, write, delete: if request.auth != null
//                                   && request.auth.uid == userId;
//     }
//     // Recurring invoices
//     match /users/{userId}/recurring/{recurId} {
//       allow read, write, delete: if request.auth != null
//                                   && request.auth.uid == userId;
//     }
//   }
// }
//
// ============================================================
