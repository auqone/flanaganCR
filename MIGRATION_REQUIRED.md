# ⚠️ DATABASE MIGRATION REQUIRED

## Important: Database Schema Changes

This commit includes breaking changes to the database schema that require migration.

## What Changed

1. **Order Model**:
   - Removed `orderNumber` field
   - Removed `paymentStatus` field
   - Removed individual shipping fields (`shippingName`, `shippingEmail`, `shippingAddress`, `shippingCity`, etc.)
   - Changed `total` → `totalAmount`
   - Changed `customerId` to optional (allows orders without customer accounts)
   - Added `customerEmail` and `customerName` fields
   - Added `stripePaymentId` (Stripe session ID)
   - Changed `shippingAddress` to JSON field for flexibility

2. **New Models**:
   - `Cart` - For tracking shopping carts and abandoned cart detection
   - `CartItem` - Individual items in shopping carts

## Migration Steps

### 1. Backup Your Database

```bash
# For PostgreSQL
pg_dump your_database_url > backup_$(date +%Y%m%d).sql
```

### 2. Run Migration (Development)

```bash
# This will prompt you to handle data migration
npx prisma migrate dev --name add_cart_and_update_order_model
```

### 3. Run Migration (Production)

```bash
# After testing in development
npx prisma migrate deploy
```

## Data Migration Considerations

### Existing Orders

If you have existing orders in your database, you'll need to handle:

1. **Missing customerEmail/customerName**: Extract from related Customer table if `customerId` exists
2. **Shipping Address JSON**: Convert individual shipping fields to JSON object:
   ```json
   {
     "line1": "old shippingAddress",
     "line2": "",
     "city": "old shippingCity",
     "state": "old shippingState",
     "postalCode": "old shippingZip",
     "country": "old shippingCountry"
   }
   ```

### Sample Migration SQL

```sql
-- Update existing orders with customer info
UPDATE "Order" o
SET
  "customerEmail" = c.email,
  "customerName" = c.name,
  "shippingAddress" = jsonb_build_object(
    'line1', o."shippingAddress",
    'line2', '',
    'city', o."shippingCity",
    'state', o."shippingState",
    'postalCode', o."shippingZip",
    'country', o."shippingCountry"
  )
FROM "Customer" c
WHERE o."customerId" = c.id;
```

## Environment Variables Required

After migration, ensure these are set in your production environment:

```bash
# Email
RESEND_API_KEY=re_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Cron Jobs
CRON_SECRET=generate_with_openssl_rand_base64_32

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Production URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Vercel Configuration

1. **Add Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables listed above

2. **Cron Jobs** (already configured in vercel.json):
   - `/api/cron/abandoned-cart` - Runs every hour
   - `/api/cron/sync-inventory` - Runs every 4 hours
   - These will activate automatically after deployment

3. **Stripe Webhook**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Testing After Migration

1. **Test Order Creation**:
   ```bash
   # Make a test purchase with Stripe test card: 4242 4242 4242 4242
   # Verify order appears in database
   ```

2. **Test Webhooks**:
   ```bash
   # Use Stripe CLI to send test webhook
   stripe trigger checkout.session.completed
   ```

3. **Test Cron Jobs**:
   ```bash
   # Manually trigger with CRON_SECRET
   curl -X POST https://yourdomain.com/api/cron/abandoned-cart \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

## Rollback Plan

If migration fails:

```bash
# Restore from backup
psql your_database_url < backup_YYYYMMDD.sql

# Revert code changes
git revert d67f6e2
git push origin main
```

## Need Help?

- Prisma Migrate Docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Contact support if you encounter issues during migration
