# Environment Variables Audit Report

## Executive Summary
CRITICAL SECURITY ISSUES found in .env files:
1. Real database credentials exposed in version control
2. Real API keys in plaintext (Stripe, Resend, Anthropic, Cloudinary, Spocket)
3. Authentication secrets hardcoded in fallback values
4. Missing validation for required environment variables

## Environment Files
- .env - CONTAINS REAL SECRETS (DANGER!)
- .env.example - Template file (safe)
- .env.local - Contains real secrets (DANGER!)

## Critical Variables Used (Server-Side Only)

| Variable | Usage | Status | Risk |
|----------|-------|--------|------|
| DATABASE_URL | PostgreSQL Prisma | EXPOSED | CRITICAL |
| NEXTAUTH_SECRET | JWT admin auth | EXPOSED | CRITICAL |
| STRIPE_SECRET_KEY | Payment processing | EXPOSED | CRITICAL |
| STRIPE_WEBHOOK_SECRET | Webhook verification | EXPOSED | CRITICAL |
| RESEND_API_KEY | Email service | EXPOSED | CRITICAL |
| ANTHROPIC_API_KEY | Claude AI SEO | MISSING | MEDIUM |
| CLOUDINARY_CLOUD_NAME | Image uploads | MISSING | MEDIUM |
| CLOUDINARY_API_KEY | Cloudinary auth | MISSING | MEDIUM |
| CLOUDINARY_API_SECRET | Cloudinary secret | MISSING | CRITICAL |
| SPOCKET_API_KEY | Dropshipping | EXPOSED | CRITICAL |
| SPOCKET_WEBHOOK_SECRET | Spocket webhook | EXPOSED | CRITICAL |
| AUTODS_API_KEY | Alternative supplier | MISSING | MEDIUM |
| CRON_SECRET | Cron auth | MISSING | CRITICAL |

## Public Variables (NEXT_PUBLIC_)

| Variable | Status |
|----------|--------|
| NEXT_PUBLIC_APP_URL | OK |
| NEXT_PUBLIC_APP_NAME | OK |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | OK (publishable) |
| NEXT_PUBLIC_GA_TRACKING_ID | OK |

## Files Using Environment Variables

### lib/auth.ts
- Uses: NEXTAUTH_SECRET (with weak fallback 'dev-secret-only-for-testing')
- Uses: NODE_ENV
- Issue: Fallback secret is too weak

### lib/customer-auth.ts
- Uses: NEXTAUTH_SECRET (with weak fallback 'your-secret-key-change-this')
- Uses: NODE_ENV
- Issue: Fallback secret is too weak

### lib/prisma.ts
- Uses: NODE_ENV
- Status: OK - uses for log level only

### lib/logger.ts
- Uses: NODE_ENV
- Status: OK

### app/api/admin/auth/route.ts
- Uses: NODE_ENV
- Status: OK

### app/api/admin/upload/route.ts
- Uses: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Issue: Variables not set in .env

### app/api/admin/optimize-seo/route.ts
- Uses: ANTHROPIC_API_KEY
- Issue: Variable not set in .env

### app/api/checkout/route.ts
- Uses: STRIPE_SECRET_KEY, NEXT_PUBLIC_APP_URL
- Status: STRIPE_SECRET_KEY exposed

### app/api/webhooks/stripe/route.ts
- Uses: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
- Status: All exposed

### app/api/admin/orders/[id]/route.ts
- Uses: RESEND_API_KEY
- Status: Exposed

### app/api/cron/sync-inventory/route.ts
- Uses: CRON_SECRET (undefined!)
- Issue: Variable not in .env

### app/api/cron/abandoned-cart/route.ts
- Uses: CRON_SECRET (undefined!)
- Issue: Variable not in .env

### lib/automation/inventorySync.ts
- Uses: SPOCKET_API_KEY
- Status: Exposed

### lib/automation/orderAutomation.ts
- Uses: SPOCKET_API_KEY, AUTODS_API_KEY
- Status: Both exposed/missing

## Security Issues

### CRITICAL
1. Real database password exposed (PostgreSQL DigitalOcean)
2. Real Stripe secret keys exposed
3. Real Spocket API keys exposed
4. Real Resend API key exposed
5. Weak hardcoded fallback secrets in auth files
6. Missing CRON_SECRET causes auth failures

### HIGH
1. Missing Cloudinary credentials (breaks image uploads)
2. Missing Anthropic API key (breaks SEO optimization)

### MEDIUM
1. Missing AUTODS_API_KEY if feature is used
2. Cookie secure flag depends on NODE_ENV (acceptable for dev)
3. No centralized config validation

## Action Items (Priority)

IMMEDIATE:
1. Add .env to .gitignore if not present
2. Regenerate all exposed keys:
   - Stripe dashboard: revoke and create new secret/webhook keys
   - Resend: regenerate API key
   - Spocket: regenerate API key
   - DigitalOcean: change PostgreSQL password
   - Cloudinary: reset credentials
3. Audit git history for exposed keys

THIS SPRINT:
4. Add missing variables to .env:
   - ANTHROPIC_API_KEY
   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   - AUTODS_API_KEY (if used)
   - CRON_SECRET
5. Remove weak fallback defaults in lib/auth.ts and lib/customer-auth.ts
6. Create lib/config.ts for centralized env validation

FUTURE:
7. Use AWS Secrets Manager or similar
8. Implement quarterly key rotation
9. Add env-specific .env files for staging/production

## Safe vs Dangerous Variables

DANGEROUS (server-side only):
- DATABASE_URL
- NEXTAUTH_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- ANTHROPIC_API_KEY
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- SPOCKET_API_KEY
- SPOCKET_WEBHOOK_SECRET
- AUTODS_API_KEY
- CRON_SECRET

SAFE (can expose):
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_GA_TRACKING_ID
