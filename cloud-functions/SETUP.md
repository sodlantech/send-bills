# Cloud Functions Setup — Send-Bills.com

## Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- SendGrid account (free tier: 100 emails/day)

## Setup Steps

### 1. Initialize Firebase Functions
```bash
cd cloud-functions
firebase init functions
# Select your Firebase project
# Choose JavaScript
```

### 2. Install Dependencies
```bash
npm install firebase-admin firebase-functions @sendgrid/mail stripe cors
```

### 3. Set Environment Config
```bash
# SendGrid API key (for sending invoice emails)
firebase functions:config:set sendgrid.key="SG.your_sendgrid_api_key"

# Your domain
firebase functions:config:set app.url="https://send-bills.com"
```

### 4. Deploy
```bash
firebase deploy --only functions
```

### 5. Set Up Stripe Webhook (optional)
In your Stripe Dashboard > Developers > Webhooks:
- Endpoint URL: `https://us-central1-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
- Events: `checkout.session.completed`

## Functions Deployed

| Function | Purpose |
|---|---|
| `sendInvoiceEmail` | Sends invoice PDF link to client's email |
| `createStripeCheckout` | Creates Stripe Checkout session for invoice payment |
| `stripeWebhook` | Auto-marks invoice as Paid when Stripe payment completes |

## SendGrid & Email Setup
**Read EMAIL-SETUP.md for the complete guide** on:
- DNS records (SPF, DKIM, DMARC) - required to avoid spam
- SendGrid domain authentication
- Testing deliverability
- Troubleshooting spam issues

## Costs
- Firebase Cloud Functions: Free for first 2M invocations/month
- SendGrid: Free for 100 emails/day
- Stripe: 2.9% + 30c per transaction (paid by user's clients)
- PayPal: ~2.9% + 30c per transaction (handled client-side, no cloud function needed)
