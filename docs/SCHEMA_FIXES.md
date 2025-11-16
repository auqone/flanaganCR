# Schema Fixes Documentation

## Overview
This document outlines the critical schema fixes applied to resolve mismatches between the database, Prisma schema, and frontend code that were causing admin dashboard and orders pages to fail.

## Issue Summary
The application had a **three-way schema mismatch** that broke:
- Admin analytics dashboard
- Orders management page
- Order email notifications
- Stripe webhook order creation

### Root Cause
1. **Database**: Had original schema with specific field structure
2. **Prisma Schema**: Had been updated but migrations were never run
3. **Code**: Referenced non-existent fields from outdated schema

## Fixed Field Mappings

### Order Model Fields

#### Changed/Removed
| Old Field | New Field | Type | Notes |
|-----------|-----------|------|-------|
| `totalAmount` | `total` | Float | Total order amount including tax/shipping |
| `customerEmail` (direct) | via Customer relation | String | Now accessed through customer.email |
| `customerName` (direct) | via Customer relation | String | Now accessed through customer.name |
| `couponCode` | (removed) | - | Use coupon relation instead |
| `discountAmount` | (removed) | - | Calculate from subtotal vs total |
| `shippingAddress` (JSON) | Individual fields | String | Flattened structure for better querying |

#### New Fields
| Field | Type | Purpose |
|-------|------|---------|
| `orderNumber` | String | Human-readable order identifier |
| `subtotal` | Float | Amount before tax/shipping |
| `shippingCost` | Float | Shipping charge (default 0) |
| `tax` | Float | Tax amount (default 0) |
| `paymentStatus` | Enum | Payment status (PENDING/PAID/FAILED) |
| `paymentMethod` | String | Payment method used |
| `shippingName` | String | Recipient name |
| `shippingEmail` | String | Recipient email |
| `shippingPhone` | String | Recipient phone |
| `shippingAddress` | String | Street address |
| `shippingCity` | String | City |
| `shippingState` | String | State/province |
| `shippingZip` | String | Postal code |
| `shippingCountry` | String | Country (default "United States") |

### Customer Relationship
```typescript
// Order now requires a Customer
order: {
  customerId: string (required, not optional)
  customer: Customer (required relation)
}
```

## Files Modified

### 1. prisma/schema.prisma
- Updated Order model with new fields
- Made customerId required
- Removed JSON shippingAddress, replaced with individual fields
- Added paymentStatus enum value
- Added orderNumber field
- Updated indexes

### 2. app/api/admin/analytics/route.ts
- Changed `_sum.totalAmount` → `_sum.total`
- Updated avgOrderValue calculation
- Fixed daily revenue SQL query (SUM("total"))
- Added customer select in recent orders query
- Properly mapped order data for response

### 3. app/api/admin/orders/[id]/route.ts
- Updated email template field references
- Changed `order.customerName` → `order.shippingName`
- Changed `order.customerEmail` → `order.shippingEmail`
- Fixed shipping address template logic
- Updated product reference in items

### 4. app/api/admin/customers/route.ts
- Changed `totalAmount` → `total` in order select

### 5. app/api/webhooks/stripe/route.ts
- Added Customer creation in checkout flow
- Updated order creation to map all fields correctly
- Changed `totalAmount` → `total`
- Added `orderNumber`, `paymentMethod`, `subtotal`
- Fixed shipping address field mapping
- Simplified email template references

### 6. package.json
- Added npm scripts for admin management:
  - `npm run check-admins` - View admin accounts
  - `npm run create-admin` - Create new admin
  - `npm run reset-password` - Reset password

### 7. scripts/
- Added three new TypeScript scripts for admin management
- Scripts use bcrypt for secure password hashing
- Interactive prompts for user input

## Admin Management Scripts

### npm run check-admins
Views all admin accounts in the database with:
- Email
- Name
- Role (ADMIN/STAFF/SUPER_ADMIN)
- Created date

### npm run create-admin
Creates a new admin account interactively:
1. Prompts for email
2. Prompts for name
3. Prompts for password
4. Hashes password with bcrypt
5. Creates admin record in database

### npm run reset-password
Resets admin password:
1. Prompts for admin email
2. Generates new password (option to enter custom)
3. Hashes and updates in database

## Testing Checklist

### Dashboard Page
- [ ] Page loads without errors
- [ ] Total Revenue displays correctly
- [ ] Total Orders shows accurate count
- [ ] Recent Orders displays with customer names
- [ ] Top Products shows with correct sales numbers
- [ ] Daily Revenue chart displays data
- [ ] Period selector (7/30/90/365 days) works
- [ ] Refresh button updates data

### Orders Page
- [ ] Orders list displays with pagination
- [ ] Customer name and email visible
- [ ] Shipping address displays correctly
- [ ] Order items show product names and quantities
- [ ] Status badges display correctly
- [ ] Edit modal opens and saves changes
- [ ] Tracking number updates work
- [ ] AliExpress links work
- [ ] Search functionality works
- [ ] Status filter works

### Email Templates
- [ ] Order confirmation email sends correctly
- [ ] Shipping notification email sends correctly
- [ ] All customer data displays (name, email, address)
- [ ] Product information includes correct details

## Deployment Notes

When deploying:
1. Ensure all files are committed (especially schema changes)
2. Prisma client will auto-regenerate on build
3. Database should have existing orders - may need migration for new fields
4. Test admin pages immediately after deployment
5. Verify email notifications in staging if possible

## Prevention

To prevent future schema mismatches:
1. Always run `npm run prisma migrate dev` after schema changes
2. Commit migrations to version control
3. Never manually edit database schema without Prisma
4. Review API responses match Prisma types
5. Use TypeScript strict mode to catch mismatches
6. Test admin pages in staging before production

## Related Issues Fixed

- ✅ Analytics dashboard "Failed to load analytics data" error
- ✅ Orders page blank/not displaying
- ✅ Customer names and emails not showing
- ✅ Email notifications with wrong field references
- ✅ Stripe webhook order creation failing
- ✅ Recent orders section in dashboard
- ✅ Top products calculation
- ✅ Daily revenue data display

## Commit Hash
- **Commit**: 2adcbb0
- **Date**: 2025-11-16
- **Message**: Fix admin dashboard and orders pages - resolve schema mismatch issues
