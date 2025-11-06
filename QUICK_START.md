# 🚀 Quick Start Guide - Flanagan Crafted Naturals

## ✅ Error Fixed!

**Problem:** `Neither apiKey nor config.authenticator provided`
**Solution:** ✅ Fixed - Anthropic client now uses lazy initialization
**Status:** App works with or without ANTHROPIC_API_KEY

---

## 🔑 Required vs Optional Environment Variables

### ✅ REQUIRED (App won't work without these)

```bash
# Database
DATABASE_URL=postgresql://...

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Service
RESEND_API_KEY=re_...

# Image Hosting
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Cron Job Security
CRON_SECRET=... (generate with: openssl rand -base64 32)

# App URL
NEXT_PUBLIC_APP_URL=https://flanagancostarica.com
```

### ⭐ OPTIONAL BUT RECOMMENDED

```bash
# Upstash Redis - For distributed rate limiting
# FREE tier available at https://upstash.com
# Without this, rate limiting uses in-memory storage (still works)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### 💡 OPTIONAL (Nice to have)

```bash
# Anthropic AI - For SEO optimization in admin dashboard
# Without this, the "Optimize SEO" button won't work
# Everything else works fine
ANTHROPIC_API_KEY=sk-ant-...

# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-...
```

---

## 📊 What Works Without Optional Variables?

### Without ANTHROPIC_API_KEY ✅
- ✅ All e-commerce features work
- ✅ Orders process normally
- ✅ Payments work
- ✅ Emails send
- ✅ Inventory management works
- ✅ Admin dashboard accessible
- ❌ "Optimize SEO" button shows error (graceful)

### Without UPSTASH_REDIS ✅
- ✅ All e-commerce features work
- ✅ Rate limiting still active (in-memory)
- ✅ Login protection works
- ⚠️ Rate limits reset on server restart
- ⚠️ Not shared across multiple instances
- 💡 Recommended for production

---

## 🎯 Minimum Setup (Production)

**Absolute minimum to get site running:**

1. Set REQUIRED variables in Vercel
2. Run database migration: \`npx prisma migrate deploy\`
3. Configure Stripe webhook
4. Verify domain in Resend
5. Done! ✅

**Recommended additions:**
- Add Upstash Redis (5 minutes, free)
- Add Anthropic API (optional, for SEO)

---

## 🔧 Current Status

| Feature | Status | Needs |
|---------|--------|-------|
| E-commerce | ✅ Working | Required env vars |
| Payments | ✅ Working | Stripe keys |
| Emails | ✅ Working | Resend key |
| Rate Limiting | ✅ Working | None (improved with Upstash) |
| Cron Jobs | ✅ Working | CRON_SECRET |
| SEO Optimization | ⚠️ Optional | ANTHROPIC_API_KEY |
| Reviews | ✅ Schema Ready | Need to run migration |

---

## 📦 Latest Commits

\`\`\`bash
284677b - Update .env.example with Upstash Redis
668decc - Fix Anthropic API initialization error ← FIXES YOUR ERROR
9079329 - Add comprehensive deployment guide
bc42a5f - Update ESLint to v9
2492526 - Add all automation features
\`\`\`

---

## 🚨 Troubleshooting

### Error: "Neither apiKey nor config.authenticator provided"
**Status:** ✅ FIXED in commit 668decc
**Solution:** Pull latest code from GitHub

### Error: Rate limiting not working
**Check:** UPSTASH_REDIS variables set?
**Fallback:** In-memory rate limiting (still works)

### Error: SEO optimization fails
**Expected:** Normal if ANTHROPIC_API_KEY not set
**Solution:** Add key or ignore (feature is optional)

### Error: Emails not sending
**Check:** RESEND_API_KEY set?
**Check:** Domain verified in Resend?

---

## 🎉 You're All Set!

Your e-commerce platform is:
- ✅ Error-free
- ✅ Production-ready
- ✅ Fully documented
- ✅ Deployed on Vercel

**Optional enhancements:**
1. Add Upstash Redis (recommended)
2. Add Anthropic API (nice to have)
3. Run database migration for reviews

---

## 📚 Documentation Files

- \`QUICK_START.md\` ← You are here
- \`DEPLOYMENT_NOTES.md\` - Complete deployment guide
- \`MIGRATION_REQUIRED.md\` - Database migration instructions
- \`.env.example\` - All environment variables explained
- \`README.md\` - Project overview

---

**Need help?** Check DEPLOYMENT_NOTES.md for detailed troubleshooting.
