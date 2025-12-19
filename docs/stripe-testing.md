# Stripe test setup (Stage 8A)

1) Add a Stripe test secret in `.env.local`: `STRIPE_SECRET_KEY=sk_test_...` and set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
2) Restart `npm run dev` so the key loads.
3) Create a test session with curl:
```
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d "{\"amount\":10,\"tierId\":\"supporter\",\"intentId\":\"maintain-site\"}"
```
4) Confirm the response includes a `url` field. Open it in the browser and complete a Stripe test checkout with the usual 4242 card.
