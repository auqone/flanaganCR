# Environment Configuration & Security Setup Guide

## Overview

This guide explains the environment variable configuration for Tigerista and the security improvements that have been made.

## Security Improvements Made

### 1. Removed Weak Fallback Secrets ✅
**Files Updated:**
- `lib/auth.ts` - Removed hardcoded development fallback `'dev-secret-only-for-testing'`
- `lib/customer-auth.ts` - Removed hardcoded development fallback `'your-secret-key-change-this'`

**Impact:** The application now fails immediately on startup if `NEXTAUTH_SECRET` is not set, preventing accidental use of weak credentials in production.

### 2. Created Environment Validation ✅
**New File:** `lib/env.ts`

This file provides:
- Centralized validation of all required environment variables
- Type-safe access to environment variables
- Clear error messages listing missing variables
- Distinguishes between required and optional variables

**Usage:**
```typescript
import { getEnv, validateEnvironment } from '@/lib/env';

// Validate all env vars are set (throws error if any missing)
validateEnvironment();

// Get validated environment with type safety
const env = getEnv();
console.log(env.DATABASE_URL);
```

### 3. Enhanced .env.example ✅
**File Updated:** `.env.example`

Now includes:
- Clear sections for each service (Database, Auth, Stripe, Email, etc.)
- Links to where to get each credential
- **REQUIRED vs OPTIONAL** marking
- Warnings about secret security
- Setup instructions

### 4. Improved Cron Job Security ✅
**Files Updated:**
- `app/api/cron/sync-inventory/route.ts`
- `app/api/cron/abandoned-cart/route.ts`

**Improvements:**
- Added proper error handling if `CRON_SECRET` is missing
- Better logging for debugging authorization failures
- Returns 500 (server error) if misconfigured, 401 (unauthorized) if invalid token

## Required Environment Variables

Copy `.env.example` to `.env` and fill in these required values:

### Database (Critical)
```
DATABASE_URL=postgresql://doadmin:PASSWORD@your-db.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```
- Get from DigitalOcean → Databases → Connection String

### Authentication (Critical)
```
NEXTAUTH_SECRET=generate_random_32_char_string_here
NEXTAUTH_URL=http://localhost:3000
```
- Generate a random secret: `openssl rand -base64 32`

### Payment Processing - Stripe (Critical)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
- Get from Stripe Dashboard → Developers → API Keys
- **IMPORTANT:** `STRIPE_SECRET_KEY` must be kept secret (server-side only)

### Email Service - Resend (Critical)
```
RESEND_API_KEY=re_...
```
- Get from Resend Dashboard → API Keys

### Image Management - Cloudinary (Critical)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- Get from Cloudinary Console → Settings → API

### Dropshipping - Spocket (Critical)
```
SPOCKET_API_KEY=your_api_key
SPOCKET_WEBHOOK_SECRET=your_webhook_secret
```
- Get from Spocket Dashboard → Settings → API

### Cron Jobs (Critical)
```
CRON_SECRET=generate_random_32_char_string_here
```
- Generate a random secret: `openssl rand -base64 32`
- Keep this secret - used to authenticate cron job requests

## Optional Environment Variables

These are only needed for specific features:

```
# AI/SEO Optimization (optional)
ANTHROPIC_API_KEY=sk_ant_...

# Additional Dropshipping Supplier (optional)
AUTODS_API_KEY=your_api_key

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-...
```

## Setup Checklist

### Step 1: Create .env File
```bash
cp .env.example .env
```

### Step 2: Update Credentials
Open `.env` and fill in:
- ✅ DATABASE_URL (from DigitalOcean)
- ✅ NEXTAUTH_SECRET (generate new: `openssl rand -base64 32`)
- ✅ STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- ✅ STRIPE_WEBHOOK_SECRET
- ✅ RESEND_API_KEY
- ✅ CLOUDINARY credentials
- ✅ SPOCKET_API_KEY and SPOCKET_WEBHOOK_SECRET
- ✅ CRON_SECRET (generate new: `openssl rand -base64 32`)

### Step 3: Verify Configuration
```bash
# Build will fail with clear error if any required env var is missing
npm run build
```

### Step 4: Test Connection
```bash
npm run dev
# Check logs for connection errors
```

## Security Best Practices

### ✅ Do's
- ✅ Generate strong random secrets: `openssl rand -base64 32`
- ✅ Keep `.env` in `.gitignore` (never commit credentials)
- ✅ Use different secrets for dev and production
- ✅ Rotate credentials regularly
- ✅ Store credentials in your hosting platform's environment variables (not in .env)
- ✅ Use HTTPS in production
- ✅ Keep SECRET keys (STRIPE_SECRET_KEY, etc.) private

### ❌ Don'ts
- ❌ Don't commit `.env` file to git
- ❌ Don't share `.env` file via email
- ❌ Don't use weak or default secrets
- ❌ Don't expose `STRIPE_SECRET_KEY` or API keys in client code
- ❌ Don't reuse the same secret for multiple purposes
- ❌ Don't check credentials into version control

## Deploying to Production

### On Vercel
1. Go to Project Settings → Environment Variables
2. Add all required variables from `.env.example`
3. Use strong, unique values for each
4. Deploy - application will validate all vars on startup

### On Other Platforms
Follow the same process:
1. Set all required environment variables
2. Ensure server can reach DigitalOcean database
3. Deploy and check logs for startup validation

## Troubleshooting

### Build fails with "Missing required environment variables"
**Solution:** Check `.env` file has all required variables filled in
```bash
npm run build
# Error message will list which variables are missing
```

### "NEXTAUTH_SECRET environment variable is required"
**Solution:** Generate and set NEXTAUTH_SECRET
```bash
# Generate a random secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET=<paste_the_random_string_here>
```

### "CRON_SECRET environment variable is not set"
**Solution:** Cron jobs need this secret to run
```bash
# Generate a random secret
openssl rand -base64 32

# Add to .env
CRON_SECRET=<paste_the_random_string_here>
```

### Database connection fails
**Solution:** Verify DigitalOcean credentials
```bash
# Check DATABASE_URL format matches:
# postgresql://user:password@host:port/database?sslmode=require

# Verify in DigitalOcean console:
# - Database exists and is running
# - Password is correct
# - Your IP is whitelisted (if applicable)
```

### Stripe/Resend/Cloudinary API errors
**Solution:** Verify API keys are correct and active
1. Check the key hasn't expired
2. Verify it has the right permissions
3. Test the key in the service's API console
4. Make sure you're using SECRET keys on server (not publishable keys)

## File Structure

```
├── .env                      # Your local credentials (DO NOT COMMIT)
├── .env.example              # Template for all required variables
├── lib/
│   ├── auth.ts              # Admin JWT auth (validates NEXTAUTH_SECRET)
│   ├── customer-auth.ts     # Customer JWT auth (validates NEXTAUTH_SECRET)
│   ├── env.ts               # Environment validation & type safety
│   └── prisma.ts            # Database client (uses DATABASE_URL)
└── app/api/cron/
    ├── sync-inventory/      # Validates CRON_SECRET
    └── abandoned-cart/      # Validates CRON_SECRET
```

## What Changed

**Before:**
- Weak hardcoded fallback secrets allowed the app to run with no credentials set
- Missing environment variables caused runtime errors in random places
- No validation or type safety for environment variables
- Credentials exposed in version control

**After:**
- ✅ Strong validation - app fails immediately if any required variable is missing
- ✅ Clear error messages listing exactly what's wrong
- ✅ Type-safe environment access with `getEnv()`
- ✅ Credentials must be explicitly configured
- ✅ No weak fallbacks - production fails safe
- ✅ Cron jobs properly validate security tokens

## Next Steps

1. **Immediately:** Rotate all exposed credentials in your `.env` file:
   - Database password (DigitalOcean)
   - Stripe keys
   - Resend API key
   - Spocket keys
   - Cloudinary secret

2. **Update .env:** Fill in all required variables with new credentials

3. **Test:** Run `npm run build` to verify all variables are set

4. **Deploy:** Push to production with environment variables set

5. **Monitor:** Check logs for any validation errors on startup
