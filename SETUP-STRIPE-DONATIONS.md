# Setup Guide: Stripe & Donations

This guide will help you configure Stripe payment processing and donation functionality for your Next.js application.

## Current Status

✅ **Code is already integrated:**
- Donation checkout flow (`/api/stripe/donation/checkout`)
- Webhook handling (`/api/stripe/webhook`)
- Donation page (`/support/donate`)
- Success/cancel pages
- Billing provider abstraction

## Step 1: Create Stripe Account & Get API Keys

1. **Sign up for Stripe**: https://stripe.com
2. **Get your API keys**:
   - Go to Stripe Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

   ⚠️ **Important**: Use test keys (`sk_test_`, `pk_test_`) for development. Live keys are blocked in non-production environments.

## Step 2: Configure Environment Variables

### Local Development (`.env.local`)

```bash
# Enable Stripe
STRIPE_ENABLED=true

# Stripe API Keys (use test keys for development)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Webhook Secret (see Step 4)
STRIPE_WEBHOOK_SECRET=whsec_...

# Site URL (required for checkout redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Predefined donation prices (see Step 3)
# STRIPE_DONATION_PRODUCT_ID=prod_...
# STRIPE_DONATION_PRICE_IDS=price_1,price_2,price_3
```

### Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the variables above for the appropriate environments:
   - **Production**: Use live keys (`sk_live_`, `pk_live_`)
   - **Preview/Development**: Use test keys (`sk_test_`, `pk_test_`)

## Step 3: Optional - Create Donation Products/Prices in Stripe

You can either:
- **Option A**: Use custom amounts (already working - users enter any amount)
- **Option B**: Create preset donation amounts in Stripe

### Option B: Create Preset Donation Prices

1. Go to Stripe Dashboard → Products
2. Create a product: "Support Ransfords Notes"
3. Add prices for preset amounts (e.g., £5, £15, £30, £75)
4. Copy the Price IDs (start with `price_`)
5. Add to environment variables:
   ```bash
   STRIPE_DONATION_PRODUCT_ID=prod_...
   STRIPE_DONATION_PRICE_IDS=price_1,price_2,price_3,price_4
   ```

## Step 4: Configure Stripe Webhook

Webhooks are required to process completed payments and update user records.

### For Local Development (using Stripe CLI)

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli
2. **Login**: `stripe login`
3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. **Copy the webhook signing secret** (starts with `whsec_`)
5. **Add to `.env.local`**: `STRIPE_WEBHOOK_SECRET=whsec_...`

### For Production (Vercel)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_`)
7. **Add to Vercel environment variables**: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Step 5: Test the Integration

### Test Donation Flow

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/support/donate`
3. Enter an amount or select a preset
4. Click "Donate"
5. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

### Test Webhook (Local)

1. Complete a test donation
2. Check Stripe CLI output for webhook events
3. Verify webhook is received and processed

### Test Webhook (Production)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your endpoint
3. View recent events and their status
4. Check for any failed deliveries

## Step 6: Verify Everything Works

### Checklist

- [ ] Donation page loads at `/support/donate`
- [ ] Can create checkout session (redirects to Stripe)
- [ ] Test payment completes successfully
- [ ] Webhook receives `checkout.session.completed` event
- [ ] Success page shows after payment
- [ ] Donation is recorded in database (if applicable)

## Environment Variables Summary

### Required
```bash
STRIPE_ENABLED=true
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Optional
```bash
STRIPE_DONATION_PRODUCT_ID=prod_...
STRIPE_DONATION_PRICE_IDS=price_1,price_2,price_3
```

## Troubleshooting

### "Stripe is not enabled"
- Check `STRIPE_ENABLED=true` is set

### "Stripe is not configured"
- Verify `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set
- Ensure keys match (both test or both live)

### "Live Stripe keys are not allowed"
- In development, only test keys (`sk_test_`, `pk_test_`) are allowed
- Use live keys only in production environment

### Webhook not receiving events
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure webhook endpoint is accessible (not behind auth)
- Check Stripe Dashboard → Webhooks for delivery status

### Payment succeeds but webhook fails
- Check webhook endpoint is accessible
- Verify webhook secret is correct
- Check server logs for webhook processing errors
- Ensure database is accessible (if storing donation records)

## Additional Features

### Credit Purchase (if enabled)
- Requires `STRIPE_PRICE_ID` for fixed-price credit purchases
- Used by `/api/stripe/create-checkout-session`

### Billing Plans
- Plans are defined in `src/lib/billing/plans.ts`
- Currently: `free`, `supporter`, `pro`
- Integration with Stripe subscriptions can be added later

## Security Notes

- ✅ Live keys are blocked in development
- ✅ Webhook signatures are verified
- ✅ Rate limiting on checkout endpoints
- ✅ Origin validation for API requests
- ✅ No card data stored (handled by Stripe)

## Next Steps

- [ ] Set up Stripe Dashboard alerts for failed payments
- [ ] Configure email receipts in Stripe
- [ ] Add subscription support (if needed)
- [ ] Set up refund handling
- [ ] Configure tax collection (if applicable)

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
