# Automation Setup - Quick Start

## ✅ What's Been Created

Your Sellery automation system is now ready! Here's what's included:

### 📁 File Structure
```
Sellery/
├── lib/
│   ├── automation/
│   │   ├── types.ts              # TypeScript definitions
│   │   ├── orderAutomation.ts    # Order forwarding to suppliers
│   │   ├── inventorySync.ts      # Stock & price synchronization
│   │   └── abandonedCart.ts      # Cart recovery automation
│   └── email/
│       └── templates.tsx         # Professional email templates
├── app/api/
│   ├── cron/
│   │   ├── sync-inventory/       # Inventory sync endpoint
│   │   └── abandoned-cart/       # Cart recovery endpoint
│   └── webhooks/
│       └── order-created/        # Order webhook handler
├── docs/
│   ├── AUTOMATION_GUIDE.md       # Complete automation guide
│   └── AUTOMATION_SETUP.md       # This file
└── vercel.json                   # Cron job configuration
```

### 🎯 Automation Features

1. **Order Fulfillment Automation**
   - Automatic forwarding to Spocket/AutoDS
   - Order status tracking
   - Confirmation emails

2. **Inventory Synchronization**
   - Runs every 4 hours
   - Real-time stock updates
   - Out-of-stock notifications

3. **Price Monitoring**
   - Dynamic pricing based on supplier changes
   - Competitive pricing algorithms
   - Automatic price adjustments

4. **Abandoned Cart Recovery**
   - Runs every hour
   - 3-email sequence with discounts
   - 10-15% off incentives

5. **Email Templates**
   - Order confirmation
   - Shipping notification
   - Abandoned cart recovery

---

## 🚀 Quick Setup (15 Minutes)

### Step 1: Environment Variables

Add to your `.env.local`:

```bash
# Supplier APIs
SPOCKET_API_KEY=your_spocket_api_key_here
AUTODS_API_KEY=your_autods_api_key_here

# Cron Security
CRON_SECRET=generate_random_secret_here

# Email Service (choose one)
RESEND_API_KEY=your_resend_api_key_here
# OR
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Database
DATABASE_URL=your_database_url_here

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### Step 2: Install Email Package

```bash
npm install resend
```

Or if using SendGrid:
```bash
npm install @sendgrid/mail
```

### Step 3: Deploy to Vercel

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Add automation system"

# Push to GitHub
git remote add origin https://github.com/yourusername/sellery.git
git push -u origin main

# Deploy to Vercel
# Go to vercel.com and import your repository
```

Vercel will automatically set up the cron jobs from `vercel.json`.

### Step 4: Set Up Webhooks

#### Stripe Webhook (for order creation)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/order-created`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to `.env.local`

#### Spocket Webhook (optional, for inventory updates)
1. Go to Spocket Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/inventory-update`
3. Select: Stock quantity changes

---

## 🧪 Testing Automation

### Test Order Automation

```bash
curl -X POST http://localhost:3000/api/webhooks/order-created \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-order-123",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "items": [{
      "id": "1",
      "productId": "1",
      "name": "Test Product",
      "price": 29.99,
      "quantity": 1
    }],
    "shippingAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "CA",
      "zipCode": "90210",
      "country": "US"
    },
    "total": 29.99,
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }'
```

### Test Inventory Sync

```bash
curl -X GET http://localhost:3000/api/cron/sync-inventory \
  -H "Authorization: Bearer your_cron_secret_here"
```

### Test Abandoned Cart

```bash
curl -X GET http://localhost:3000/api/cron/abandoned-cart \
  -H "Authorization: Bearer your_cron_secret_here"
```

---

## 📧 Email Service Setup

### Option 1: Resend (Recommended - Easiest)

1. Sign up at https://resend.com
2. Verify your domain
3. Get API key from Dashboard
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

**Pricing:** Free 3,000 emails/month, then $20/month for 50k

### Option 2: SendGrid

1. Sign up at https://sendgrid.com
2. Verify sender identity
3. Create API key
4. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

**Pricing:** Free 100 emails/day, then $15/month for 40k

---

## 🔄 Cron Jobs Explained

### Inventory Sync
- **Schedule:** Every 4 hours (`0 */4 * * *`)
- **What it does:**
  - Fetches latest inventory from Spocket
  - Updates stock quantities
  - Sends out-of-stock alerts
  - Adjusts prices based on supplier changes

### Abandoned Cart Recovery
- **Schedule:** Every hour (`0 * * * *`)
- **What it does:**
  - Finds carts abandoned 1+ hours ago
  - Sends recovery email with 10% discount
  - Schedules follow-up emails (24h, 3d)

### Custom Cron Jobs

Add more to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-report",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/update-prices",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Cron Schedule Format:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

**Examples:**
- `0 * * * *` - Every hour
- `0 */4 * * *` - Every 4 hours
- `0 9 * * *` - Every day at 9 AM
- `0 0 * * 0` - Every Sunday at midnight

---

## 🎨 Customizing Email Templates

Edit `lib/email/templates.tsx` to customize:

1. **Branding:** Change colors, logo, fonts
2. **Content:** Modify copy and messaging
3. **Structure:** Add/remove sections
4. **CTAs:** Update button text and links

Example customization:

```typescript
// Change brand color
style="background-color: #667eea;" // Your brand color

// Update logo
<h1>YourBrand</h1>

// Modify discount
const discountCode = 'YOURCODE10';
```

---

## 📊 Monitoring Automation

### Check Cron Job Logs

Vercel Dashboard → Your Project → Logs → Filter by `/api/cron`

### Monitor Order Processing

Add logging to track automation:

```typescript
console.log(`✅ Order ${orderId} forwarded to supplier`);
console.log(`📧 Confirmation email sent to ${email}`);
console.log(`📦 Inventory synced: ${updated} products updated`);
```

### Set Up Alerts

Use services like:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Better Uptime** - Uptime monitoring

---

## 💡 Best Practices

1. **Always test in development first**
   ```bash
   npm run dev
   # Test locally before deploying
   ```

2. **Monitor automation logs daily**
   - Check for failed orders
   - Watch for API errors
   - Review email delivery rates

3. **Keep backup of critical data**
   - Database backups daily
   - Order history
   - Customer emails

4. **Rate limiting**
   - Don't spam suppliers with requests
   - Respect API rate limits
   - Implement retry logic with exponential backoff

5. **Error handling**
   - Always catch errors
   - Send alerts for critical failures
   - Have manual fallback procedures

---

## 🚨 Common Issues & Solutions

### Issue: Cron jobs not running

**Solution:**
- Verify `vercel.json` is in root directory
- Check you're on Vercel Pro plan ($20/month)
- Verify cron endpoints return 200 status

### Issue: Emails not sending

**Solution:**
- Check API key is correct
- Verify domain is verified (for Resend/SendGrid)
- Check email logs in service dashboard

### Issue: Supplier API failing

**Solution:**
- Verify API keys are correct
- Check API rate limits
- Review supplier API documentation

### Issue: Database connection timeout

**Solution:**
- Check connection string
- Verify database is running
- Check connection pooling limits

---

## 📈 Next Steps

### Week 1
- [ ] Set up email service (Resend)
- [ ] Deploy to Vercel
- [ ] Test order automation flow
- [ ] Configure Stripe webhook

### Week 2
- [ ] Enable inventory sync
- [ ] Test abandoned cart recovery
- [ ] Monitor email delivery rates
- [ ] Set up error alerts

### Week 3
- [ ] Add database for real data
- [ ] Implement user authentication
- [ ] Connect real supplier accounts
- [ ] Test end-to-end flow

### Week 4
- [ ] Optimize automation based on metrics
- [ ] Add more email sequences
- [ ] Implement dynamic pricing
- [ ] Launch to customers!

---

## 🎯 Success Metrics to Track

- **Order Automation:** 100% of orders auto-forwarded
- **Inventory Sync:** 0 out-of-stock sales
- **Email Delivery:** 95%+ delivery rate
- **Cart Recovery:** 10-15% recovery rate
- **Price Optimization:** Maintain 100%+ markup

---

## 📚 Additional Resources

- **Automation Guide:** See `AUTOMATION_GUIDE.md` for detailed implementation
- **Spocket API Docs:** https://help.spocket.co/
- **AutoDS API Docs:** https://www.autods.com/api/
- **Resend Docs:** https://resend.com/docs
- **Vercel Cron Docs:** https://vercel.com/docs/cron-jobs

---

**Questions?** Check the main `AUTOMATION_GUIDE.md` for detailed explanations of every feature.

---

Last Updated: 2025-10-01
