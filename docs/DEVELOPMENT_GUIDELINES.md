# Development Guidelines - Schema and API Consistency

## Critical Rules to Prevent Breaking Changes

### 1. Schema Changes Protocol

**ALWAYS follow this sequence when modifying the database schema:**

```bash
# Step 1: Update prisma/schema.prisma
# Step 2: Create a migration
npx prisma migrate dev --name description_of_change

# Step 3: Verify schema changes
npx prisma generate

# Step 4: Update API endpoints to use new fields
# Step 5: Test locally
npm run dev

# Step 6: Commit BOTH the schema changes AND migration
git add prisma/schema.prisma prisma/migrations/
git commit -m "Update database schema: [description]"
```

### 2. Field Naming Conventions

**Order Fields Must Follow This Pattern:**
```typescript
// ✅ CORRECT - Descriptive, nested, consistent
customer: {
  name: string
  email: string
}
shipping: {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

// ❌ WRONG - Flat, inconsistent naming
customerEmail: string
customerName: string
shippingAddress: Json  // Don't use JSON for structured data
```

### 3. API Response Contracts

**Define and document response types:**

```typescript
// ✅ GOOD - Clear interface
interface AnalyticsResponse {
  period: number
  summary: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: { name: string; email: string }
    total: number
    status: string
    createdAt: string
  }>
}

// ❌ BAD - Returns raw DB object
return { data: orders }  // No type contract
```

### 4. Database to API Mapping

**Always transform database results for API responses:**

```typescript
// ✅ GOOD - Map DB fields to API response
const orders = await prisma.order.findMany({
  include: { customer: true }
})

const response = orders.map(order => ({
  id: order.id,
  orderNumber: order.orderNumber,
  customer: {
    name: order.customer.name,
    email: order.customer.email
  },
  total: order.total,
  status: order.status,
  createdAt: order.createdAt.toISOString()
}))

// ❌ BAD - Return raw DB object
return { data: orders }  // Exposes all fields, hard to change
```

### 5. Email Templates

**Never hardcode field access in templates:**

```typescript
// ✅ GOOD - Use validated data
const emailData = {
  customerName: order.customer.name,
  customerEmail: order.customer.email,
  orderNumber: order.orderNumber,
  shippingAddress: order.shippingAddress
}

const html = `
  <p>Hi ${escapeHtml(emailData.customerName)},</p>
  <p>Order: ${escapeHtml(emailData.orderNumber)}</p>
  <p>Address: ${escapeHtml(emailData.shippingAddress)}</p>
`

// ❌ BAD - Direct field access
const html = `
  <p>Hi ${order.customerName},</p>
  <p>Address: ${order.shippingAddress.line1}</p>  // Breaks if schema changes
`
```

### 6. Prisma Query Best Practices

**Always be explicit about relationships:**

```typescript
// ✅ GOOD - Explicitly select customer fields
const orders = await prisma.order.findMany({
  include: {
    customer: {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
})

// ❌ BAD - Implicit relationship
const orders = await prisma.order.findMany({
  include: { customer: true }  // Loads all customer fields
})

// ❌ WRONG - Missing relation
const orders = await prisma.order.findMany()  // customer is undefined
```

### 7. Type Safety

**Always use TypeScript interfaces for responses:**

```typescript
// ✅ GOOD - Typed responses prevent mismatches
interface Order {
  id: string
  orderNumber: string
  total: number
  customer: {
    name: string
    email: string
  }
  shipping: {
    address: string
    city: string
    state: string
    zip: string
  }
}

const response: Order[] = ...

// ❌ BAD - No types
const response = await prisma.order.findMany()
return response  // Could return anything
```

### 8. Webhook Data Transformation

**Always validate and map webhook data to schema:**

```typescript
// ✅ GOOD - Map Stripe data to Order fields
const order = await prisma.order.create({
  data: {
    customerId: customer.id,
    orderNumber: `ORD-${Date.now()}`,
    total: (session.amount_total || 0) / 100,
    subtotal: (session.amount_total || 0) / 100 - discount,
    shippingName: session.customer_details?.name || '',
    shippingEmail: session.customer_details?.email || '',
    shippingAddress: session.customer_details?.address?.line1 || '',
    shippingCity: session.customer_details?.address?.city || '',
    shippingState: session.customer_details?.address?.state || '',
    shippingZip: session.customer_details?.address?.postal_code || '',
    status: 'PAID'
  }
})

// ❌ BAD - Direct field mapping
const order = await prisma.order.create({
  data: {
    customerEmail: session.customer_details?.email,
    customerName: session.customer_details?.name,
    shippingAddress: session.customer_details?.address  // Type mismatch!
  }
})
```

### 9. Testing Changes

**After any schema change, test these:**

```bash
# Build test
npm run build

# Type check
npx tsc --noEmit

# Test admin pages
# - Dashboard loads
# - Orders display
# - Analytics calculate
# - Email templates work

# Test API endpoints
curl http://localhost:3000/api/admin/analytics
curl http://localhost:3000/api/admin/orders
```

### 10. Code Review Checklist

When reviewing changes:

- [ ] Schema changes have migrations
- [ ] API responses match TypeScript interfaces
- [ ] Database queries include all necessary relations
- [ ] Email templates use mapped data, not raw objects
- [ ] Webhook handlers transform data to schema
- [ ] No `as any` or type assertions to bypass checks
- [ ] Admin pages tested in browser
- [ ] Build passes without type errors
- [ ] Tests pass (if applicable)

## Common Mistakes to Avoid

### ❌ Mistake #1: Changing Schema Without Migration
```typescript
// Don't do this:
// Manually edit database
// Update schema.prisma
// Hope code still works

// Do this instead:
npx prisma migrate dev --name add_field
// Code updates
// Test
// Commit
```

### ❌ Mistake #2: Accessing Nested Fields Without Including Relation
```typescript
// Wrong:
const orders = await prisma.order.findMany()
orders.forEach(o => console.log(o.customer.name))  // Crashes! customer is undefined

// Right:
const orders = await prisma.order.findMany({
  include: { customer: true }
})
orders.forEach(o => console.log(o.customer.name))  // Works!
```

### ❌ Mistake #3: Returning Raw Database Objects
```typescript
// Bad - exposes all fields, hard to maintain
return NextResponse.json(orders)

// Good - controlled API contract
return NextResponse.json({
  data: orders.map(o => ({
    id: o.id,
    orderNumber: o.orderNumber,
    total: o.total
  }))
})
```

### ❌ Mistake #4: JSON Fields for Structured Data
```typescript
// Bad - can't query, hard to type
shippingAddress: Json  // Stores {line1, line2, city, state, zip, country}

// Good - queryable, typed
shippingAddress: String
shippingCity: String
shippingState: String
shippingZip: String
```

### ❌ Mistake #5: Forgetting to Update All References
```typescript
// Renamed field from totalAmount to total
// Updated schema ✓
// Updated analytics API ✓
// Updated orders API ✓
// Forgot to update: customers API ✗  <- BREAKS

// Always search codebase:
grep -r "totalAmount" app/api/
grep -r "customerName" app/
grep -r "shippingAddress as" app/  // Type assertions
```

## Quick Reference

### File Change Impacts

| File | Breaking Changes? | Test Required |
|------|-------------------|---------------|
| `prisma/schema.prisma` | ✅ YES | All admin pages, all APIs |
| `app/api/admin/analytics/route.ts` | ✅ YES | Dashboard page |
| `app/api/admin/orders/route.ts` | ✅ YES | Orders page |
| `app/api/webhooks/stripe/route.ts` | ✅ YES | Checkout flow |
| `app/admin/dashboard/page.tsx` | ✅ YES | Dashboard page |
| `app/admin/orders/page.tsx` | ✅ YES | Orders page |

### Commands to Run After Schema Changes

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Create migration (if using migrations)
npx prisma migrate dev

# 3. Type check
npx tsc --noEmit

# 4. Build
npm run build

# 5. Test locally
npm run dev

# 6. Commit
git add prisma/ app/
git commit -m "Fix: description"

# 7. Deploy
git push origin main
```

## Questions?

Before making schema changes, ask yourself:
1. ✅ Is this change documented?
2. ✅ Do I have a migration?
3. ✅ Are all code references updated?
4. ✅ Does it compile without errors?
5. ✅ Do admin pages still work?
6. ✅ Are email templates correct?

If you can't answer yes to all 6 questions, don't push to production!
