# Quick Reference - Admin Page Schema

## Order Model - Current Field Structure

```typescript
// Complete Order structure after fixes
{
  id: string
  orderNumber: string              // Human-readable: "ORD-1234567890"

  // Customer relationship (REQUIRED)
  customerId: string
  customer: {
    id: string
    name: string
    email: string
  }

  // Pricing
  subtotal: number                 // Before tax/shipping
  shippingCost: number            // Shipping fee (default 0)
  tax: number                      // Tax amount (default 0)
  total: number                    // Final amount

  // Payment
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  paymentMethod: string            // "stripe", "paypal", etc
  stripePaymentId?: string
  stripePaymentIntentId?: string

  // Shipping info (individual fields, NOT JSON)
  shippingName: string
  shippingEmail: string
  shippingPhone?: string
  shippingAddress: string          // "123 Main St"
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string          // Default: "United States"

  // Tracking
  trackingNumber?: string
  trackingUrl?: string

  // AliExpress fulfillment
  aliexpressOrderId?: string
  aliexpressOrderUrl?: string

  // Notes
  adminNotes?: string
  customerNotes?: string

  // Order items
  orderItems: OrderItem[]

  // Status and timestamps
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  shippedAt?: Date
  deliveredAt?: Date
  cancelledAt?: Date
  refundedAt?: Date
}
```

## ⚠️ DO NOT USE - REMOVED FIELDS

These fields **NO LONGER EXIST** - using them will cause build errors:

```typescript
// ❌ REMOVED - Use customer.name instead
order.customerName

// ❌ REMOVED - Use customer.email instead
order.customerEmail

// ❌ REMOVED - Use totalAmount instead
order.totalAmount

// ❌ REMOVED - Don't use JSON objects
order.shippingAddress as JSON

// ❌ REMOVED - Use customer relation
// There is no direct couponCode field
```

## API Response Examples

### Analytics API Response
```typescript
// GET /api/admin/analytics?period=30
{
  period: 30,
  summary: {
    totalRevenue: 1500.50,
    totalOrders: 42,
    totalCustomers: 38,
    avgOrderValue: 35.72,
    totalProfit: 450.00
  },
  recentOrders: [
    {
      id: "clx...",
      orderNumber: "ORD-1234567890",
      total: 99.99,
      status: "SHIPPED",
      createdAt: "2025-11-16T10:21:00Z",
      customer: {
        name: "John Doe",
        email: "john@example.com"
      }
    }
  ],
  ordersByStatus: [
    { status: "PAID", _count: { status: 25 } }
  ],
  topProducts: [
    {
      id: "...",
      name: "Product Name",
      price: 29.99,
      image: "...",
      totalSold: 15,
      orderCount: 12
    }
  ],
  dailyRevenue: [
    {
      date: "2025-11-16",
      revenue: 150.00,
      orders: 5
    }
  ]
}
```

### Orders API Response
```typescript
// GET /api/admin/orders
{
  data: [
    {
      id: "clx...",
      orderNumber: "ORD-1234567890",
      status: "SHIPPED",
      paymentStatus: "PAID",
      total: 99.99,
      shippingName: "Jane Smith",
      shippingEmail: "jane@example.com",
      shippingAddress: "456 Oak Ave",
      shippingCity: "Portland",
      shippingState: "OR",
      shippingZip: "97201",
      shippingCountry: "United States",
      trackingNumber: "1Z999AA10123456784",
      trackingUrl: "https://tools.usps.com/...",
      aliexpressOrderId: "8012345678901234",
      aliexpressOrderUrl: "https://www.aliexpress.com/...",
      adminNotes: "Shipped on 2025-11-16",
      createdAt: "2025-11-15T15:30:00Z",
      orderItems: [
        {
          id: "...",
          quantity: 2,
          price: 49.99,
          product: {
            id: "...",
            name: "Product Name",
            aliexpressUrl: "https://www.aliexpress.com/..."
          }
        }
      ]
    }
  ],
  pagination: {
    page: 1,
    limit: 50,
    total: 42,
    pages: 1
  }
}
```

## Email Template Fields

### Order Confirmation Email
```typescript
// Use these fields ONLY (properly mapped)
{
  customerName: order.customer.name          // ✅ Correct
  customerEmail: order.customer.email        // ✅ Correct
  orderNumber: order.orderNumber             // ✅ Correct
  orderDate: order.createdAt                 // ✅ Correct

  // Shipping address - use individual fields
  shippingName: order.shippingName
  shippingAddress: order.shippingAddress
  shippingCity: order.shippingCity
  shippingState: order.shippingState
  shippingZip: order.shippingZip
  shippingCountry: order.shippingCountry

  // Items - access via orderItems
  items: order.orderItems.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.price
  }))
}
```

## Common Tasks

### Accessing Order Data in Code

```typescript
// ✅ CORRECT
const name = order.customer.name
const email = order.customer.email
const total = order.total
const address = order.shippingAddress
const city = order.shippingCity

// ❌ WRONG - Will fail
const name = order.customerName           // Doesn't exist!
const email = order.customerEmail         // Doesn't exist!
const address = order.shippingAddress.line1  // Not a JSON object!
```

### Fetching Orders with Customer Data

```typescript
// ✅ CORRECT - Include customer relation
const orders = await prisma.order.findMany({
  include: {
    customer: {
      select: {
        name: true,
        email: true
      }
    },
    orderItems: {
      include: {
        product: true
      }
    }
  }
})

// ❌ WRONG - Missing customer relation
const orders = await prisma.order.findMany()  // customer is undefined!
```

### Creating Orders (from Stripe webhook)

```typescript
// ✅ CORRECT - All required fields
const order = await prisma.order.create({
  data: {
    customerId: customer.id,                    // Required!
    orderNumber: `ORD-${Date.now()}`,
    total: session.amount_total / 100,
    subtotal: subtotal,
    paymentStatus: 'PAID',
    status: 'PAID',
    paymentMethod: 'stripe',
    stripePaymentId: session.id,

    shippingName: session.customer_details?.name || '',
    shippingEmail: session.customer_details?.email || '',
    shippingAddress: session.customer_details?.address?.line1 || '',
    shippingCity: session.customer_details?.address?.city || '',
    shippingState: session.customer_details?.address?.state || '',
    shippingZip: session.customer_details?.address?.postal_code || '',
    shippingCountry: session.customer_details?.address?.country || 'United States'
  }
})

// ❌ WRONG - Old field names
const order = await prisma.order.create({
  data: {
    customerEmail: '...',              // Doesn't exist!
    customerName: '...',               // Doesn't exist!
    totalAmount: 99.99,                // Should be 'total'!
    shippingAddress: { ... }           // Should be string fields!
  }
})
```

## Debugging Checklist

If admin pages break:

1. **Check the error message** - Does it mention a missing field?
   - Look up that field in this reference
   - Verify it hasn't been removed or renamed

2. **Search codebase** for the old field name
   ```bash
   grep -r "customerName" app/
   grep -r "customerEmail" app/
   grep -r "totalAmount" app/
   grep -r "shippingAddress as" app/
   ```

3. **Build and check types**
   ```bash
   npm run build
   npx tsc --noEmit
   ```

4. **Check recent commits** - Did someone modify schema?
   ```bash
   git log --oneline docs/ prisma/
   ```

5. **Read the full documentation**
   - `docs/SCHEMA_FIXES.md` - Complete fix details
   - `docs/DEVELOPMENT_GUIDELINES.md` - Prevention guidelines

## Admin Scripts

```bash
# Check all admin accounts
npm run check-admins

# Create new admin (interactive)
npm run create-admin

# Reset admin password (interactive)
npm run reset-password
```

## Testing After Changes

```bash
# 1. Build locally
npm run build

# 2. Run dev server
npm run dev

# 3. Test these pages:
# - http://localhost:3000/admin/dashboard
# - http://localhost:3000/admin/orders
# - http://localhost:3000/admin/customers

# 4. Verify:
# - Dashboard loads analytics
# - Orders display with customer info
# - Recent orders show correct data
# - Edit modal works for orders
# - No console errors
```

## Commits That Fixed This

1. **2adcbb0** - Fix admin dashboard and orders pages - resolve schema mismatch issues
2. **e9e8069** - docs: Add comprehensive schema fixes and development guidelines

Review these commits to understand all changes made.
