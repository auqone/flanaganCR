# Production Deployment Checklist

This checklist covers the critical items that must be completed before deploying to production.

## Security

- [x] **Admin Authentication Restored** - Authentication checks are active in `app/admin/layout.tsx`
- [x] **API Authorization** - All admin endpoints protected with `withAdminAuth` middleware
- [x] **JWT Configuration** - Token expiry reduced to 7 days (from 90 days)
- [x] **Environment Variables Required** - `NEXTAUTH_SECRET` must be set in production
- [x] **Error Logging** - Structured logging implemented for security events

### Before Production Deployment:

- [ ] **Rotate Credentials** - The database credentials and API keys in `.env` appear to have been exposed. Rotate:
  - [ ] Supabase database password
  - [ ] Resend API key
  - [ ] All other API keys in `.env`

- [ ] **Set NEXTAUTH_SECRET** - Generate a strong random secret:
  ```bash
  openssl rand -base64 32
  ```

- [ ] **Enable HTTPS** - Ensure `secure: true` for cookies (already set for production in `lib/auth.ts`)

- [ ] **CORS Configuration** - Review and configure CORS if needed for third-party integrations

- [ ] **Rate Limiting** - Verify rate limiting is enabled for all API endpoints

## Database

- [ ] **Verify Connection** - Test database connection string in production environment
- [ ] **Run Migrations** - Ensure all Prisma migrations are applied:
  ```bash
  npx prisma migrate deploy
  ```

- [ ] **Database Backups** - Configure automated backups (Supabase provides this)

- [ ] **Test Queries** - Verify pagination works correctly with production data volumes

## API & Endpoints

- [x] **Input Validation** - Added pagination and input sanitization to admin endpoints
- [x] **Pagination** - Implemented for:
  - [x] Customers endpoint
  - [x] Orders endpoint
  - [x] Subscribers endpoint
- [ ] **Stripe Integration** - Verify webhook secret is correctly configured:
  - [ ] `STRIPE_SECRET_KEY` set correctly
  - [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
  - [ ] Webhook endpoint is registered in Stripe

- [ ] **Resend Email** - Verify email sending is working:
  - [ ] `RESEND_API_KEY` is valid
  - [ ] Email templates are correct
  - [ ] Test order confirmation email

## Monitoring & Logging

- [x] **Error Logging Utility** - Created `lib/logger.ts` for structured logging
- [ ] **Configure External Logging** - Set up one of:
  - [ ] Sentry (recommended for error tracking)
  - [ ] DataDog
  - [ ] Loggly
  - [ ] CloudWatch (if using AWS)

- [ ] **Health Checks** - Implement health check endpoint for monitoring
- [ ] **Performance Monitoring** - Consider implementing:
  - [ ] Next.js Analytics (built-in)
  - [ ] Web Vitals monitoring
  - [ ] Database query performance analysis

## Build & Deployment

- [ ] **Build Test** - Run build and verify no errors:
  ```bash
  npm run build
  ```

- [ ] **Environment Variables** - Ensure all required vars are set in production:
  - [ ] `NEXTAUTH_SECRET` (critical)
  - [ ] `DATABASE_URL`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `RESEND_API_KEY`
  - [ ] `CLOUDINARY_*` (if using image uploads)

- [ ] **Vercel Deployment** - If deploying to Vercel:
  - [ ] Environment variables set in Vercel dashboard
  - [ ] Preview deployments working correctly
  - [ ] Production domain configured

- [ ] **SSL/TLS Certificate** - Ensure HTTPS is enabled

## Testing

- [ ] **Admin Panel Tests** - Verify:
  - [ ] Login works correctly
  - [ ] Session timeout after 7 days
  - [ ] Dashboard loads analytics data
  - [ ] Can create/update/delete products
  - [ ] Can view and manage orders
  - [ ] Can view customer list with pagination

- [ ] **Customer Features** - Test:
  - [ ] Product browsing and filtering
  - [ ] Add to cart functionality
  - [ ] Checkout process
  - [ ] Stripe payment processing
  - [ ] Order confirmation emails

- [ ] **API Tests** - Verify:
  - [ ] Unauthorized requests are rejected
  - [ ] Rate limiting works
  - [ ] Pagination returns correct data
  - [ ] Error responses are properly formatted

## Documentation

- [ ] **Update README** - Document deployment process
- [ ] **Environment Variables Docs** - Document all required variables
- [ ] **Admin Guide** - Create guide for admin panel usage

## Post-Deployment

- [ ] **Monitor Logs** - Watch for errors in production
- [ ] **Test All Features** - Full end-to-end test in production
- [ ] **Monitor Performance** - Check page load times and API response times
- [ ] **Verify Payments** - Confirm test transactions work correctly

---

## Security Warnings

⚠️ **Critical**: The `.env` file contains database credentials. These must be rotated immediately if exposed:
- Supabase connection string
- Resend API key

✅ **Fixed**: All critical authentication issues have been addressed
✅ **Fixed**: Input validation and pagination implemented
✅ **Fixed**: Error logging utility created

---

## Resources

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-dependencies)
- [Stripe Integration Guide](https://stripe.com/docs/integrations/next-js)
