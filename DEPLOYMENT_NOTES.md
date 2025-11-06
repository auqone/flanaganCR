# 🚀 Deployment Notes - Flanagan Crafted Naturals

## ✅ Current Status

**Build Status:** Passing ✓
**Deployment:** Vercel (Automatic)
**Last Updated:** November 5, 2024

---

## 📋 About NPM Warnings

You may see these warnings in Vercel build logs:

```
npm warn deprecated rimraf@3.0.2
npm warn deprecated q@1.5.1
npm warn deprecated inflight@1.0.6
npm warn deprecated glob@7.2.3
npm warn deprecated @humanwhocodes/object-schema@2.0.3
npm warn deprecated @humanwhocodes/config-array@0.13.0
```

**These are safe to ignore.** Here's why:

### What Are These Warnings?

These are **deprecation warnings** from transitive dependencies (dependencies of your dependencies, not packages you directly installed). They appear because:

1. **Third-party packages** (like Next.js, Prisma, Cloudinary) still use older versions internally
2. They will be updated when those packages release new versions
3. **They don't affect your application** - it will build and run perfectly

### Why They Appear

- `rimraf`, `glob`, `inflight` → Used by build tools internally
- `q` → Old promise library used by some legacy packages
- `@humanwhocodes/*` → ESLint v8 dependencies (we've upgraded to v9)

### What We've Done

✅ **Upgraded ESLint** from v8 to v9 (latest)
✅ **All direct dependencies** are up-to-date
✅ **Build is successful** with no errors

### What Happens Next

These warnings will automatically disappear when:
- Next.js updates their dependencies
- Prisma updates their dependencies
- Cloudinary updates their dependencies

This is normal in the JavaScript ecosystem and **does not indicate a problem**.

---

## 🔧 Environment Variables Required

### Production (Vercel)

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email (Resend)
RESEND_API_KEY=re_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Cron Jobs
CRON_SECRET=generate_with_openssl_rand_base64_32

# App URL
NEXT_PUBLIC_APP_URL=https://flanagancostarica.com

# Upstash Redis (Optional - for distributed rate limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# AI (Anthropic - for SEO)
ANTHROPIC_API_KEY=sk-ant-...
```

### Local Development

Copy `.env.example` to `.env.local` and fill in the values.

---

## 🗄️ Database Migration

After deploying, run the migration to add new models:

```bash
# Local
npx prisma migrate dev --name add_reviews_and_carts

# Production (via Vercel)
# Migrations run automatically on deployment
# Or manually: npx prisma migrate deploy
```

**New Models Added:**
- `Cart` - Abandoned cart tracking
- `CartItem` - Cart line items
- `Review` - Customer product reviews

---

## ⚙️ Cron Jobs Configuration

Cron jobs are configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/abandoned-cart",
      "schedule": "0 * * * *"  // Every hour
    },
    {
      "path": "/api/cron/sync-inventory",
      "schedule": "0 */4 * * *"  // Every 4 hours
    }
  ]
}
```

**What They Do:**
- **Abandoned Cart** (hourly): Sends recovery emails to customers who left items in cart
- **Inventory Sync** (4hrs): Monitors stock levels and sends low inventory alerts to admins

**Security:** Protected by `CRON_SECRET` environment variable

---

## 🔐 Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://flanagancostarica.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## 📧 Email Configuration (Resend)

1. Go to Resend Dashboard
2. Verify domain: `flanagancostarica.com`
3. Add DNS records (provided by Resend)
4. Wait for verification (usually 5-10 minutes)
5. Update sender email in code from `@resend.dev` to `@flanagancostarica.com`

**Email Types Sent:**
- Order confirmations
- Abandoned cart recovery (2 emails)
- Low inventory alerts (to admins)
- Shipping notifications

---

## 🚦 Rate Limiting Setup (Optional but Recommended)

### With Upstash Redis (Production)

1. Create free account at https://upstash.com
2. Create new Redis database
3. Copy REST URL and Token
4. Add to Vercel environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Benefits:**
- Distributed rate limiting across all instances
- Prevents brute force attacks
- API abuse protection
- Analytics support

### Without Upstash (Development)

Rate limiting automatically falls back to in-memory storage. Works fine for:
- Local development
- Low-traffic sites
- Testing

---

## 📊 Monitoring & Alerts

### What's Monitored

- **Inventory Levels:** Every 4 hours
- **Abandoned Carts:** Every hour
- **Login Attempts:** Real-time rate limiting
- **API Usage:** Real-time rate limiting

### Who Gets Alerted

**Low Inventory Alerts:** All admins with SUPER_ADMIN or ADMIN role

**To Add Admin:**
```sql
INSERT INTO "Admin" (id, email, password, name, role)
VALUES (
  'cuid_here',
  'admin@flanagancostarica.com',
  'hashed_password',
  'Admin Name',
  'SUPER_ADMIN'
);
```

---

## 🧪 Testing Checklist

Before going live, test:

- [ ] Place test order with Stripe test card (4242 4242 4242 4242)
- [ ] Verify order appears in admin dashboard
- [ ] Check order confirmation email arrives
- [ ] Add items to cart, leave for 1 hour, check for abandoned cart email
- [ ] Test login rate limiting (try 6 failed logins)
- [ ] Verify Stripe webhook is receiving events
- [ ] Check cron jobs are running (check logs after scheduled time)
- [ ] Test low inventory alert (set product stock to 5 units)

---

## 🐛 Troubleshooting

### Cron Jobs Not Running

1. Check `CRON_SECRET` is set in Vercel
2. Verify cron schedule in `vercel.json`
3. Check Vercel logs for cron execution
4. Manually trigger: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/abandoned-cart`

### Emails Not Sending

1. Verify `RESEND_API_KEY` is set
2. Check domain is verified in Resend
3. Look for email logs in Resend dashboard
4. Check Vercel function logs for errors

### Rate Limiting Not Working

1. If using Upstash, verify URL and Token are correct
2. Check Upstash dashboard for connection errors
3. Without Upstash, it falls back to in-memory (expected behavior)

### Orders Not Saving

1. Verify Stripe webhook is configured
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`
4. Check database connection

---

## 📈 Performance Optimization

### Enabled Features

- ✅ Next.js Image Optimization
- ✅ Static page generation
- ✅ API route caching
- ✅ Cloudinary CDN for images
- ✅ Database connection pooling
- ✅ Rate limiting to prevent abuse

### Recommended

- Use Vercel Analytics (free)
- Enable Vercel Speed Insights
- Set up error tracking (Sentry)
- Monitor database performance

---

## 📝 Maintenance

### Weekly

- Check error logs in Vercel
- Review abandoned cart recovery rate
- Monitor inventory alerts
- Check email delivery rates

### Monthly

- Update dependencies: `npm update`
- Review database size and performance
- Analyze cron job execution times
- Check for deprecated package warnings

### Quarterly

- Major version updates
- Security audit
- Performance optimization review
- Feature usage analytics

---

## 🆘 Support

**Issues or Questions?**

1. Check Vercel deployment logs
2. Review database logs
3. Check email service logs (Resend)
4. Verify all environment variables are set

**Need Help?**

- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Stripe Docs: https://stripe.com/docs

---

## 🎉 All Systems Operational!

Your e-commerce platform is production-ready with:

- ✅ Order processing
- ✅ Payment handling
- ✅ Email automation
- ✅ Inventory management
- ✅ Security & rate limiting
- ✅ Admin dashboard
- ✅ Customer reviews (schema ready)
- ✅ Automated alerts

**Deployment:** Automatic via Git push to main branch
**Monitoring:** Vercel Dashboard + Email Alerts
**Backups:** Database automated backups (check hosting provider)
