# COMPREHENSIVE ADMIN CODE SECURITY & BUG SCAN

## CRITICAL SEVERITY BUGS (6)

### 1. No Role-Based Access Control (RBAC)
- **Files**: All app/api/admin/** routes, lib/auth.ts
- **Line**: auth.ts:62, all admin routes
- **Bug**: Admin roles (SUPER_ADMIN, ADMIN, STAFF) are stored but never validated for authorization
- **Impact**: Staff can delete products, modify orders, access financial data they shouldn't
- **Fix**: Add role validation middleware

### 2. Path Traversal in Private Images
- **File**: app/api/admin/private-images/[filename]/route.ts:27
- **Bug**: Only checks "/" and ".." but misses Windows backslashes and encoded sequences
- **Attack**: filename = "..\\..\\sensitive" bypasses validation
- **Fix**: Use path.resolve() and verify normalized path

### 3. Missing Discount Validation
- **File**: app/api/admin/coupons/route.ts:78
- **Bug**: No check that discountValue >= 0
- **Impact**: Negative discounts add money instead of subtracting
- **Fix**: Add: if (discountValue < 0) return error

### 4. Missing Coupon Usage Counter
- **File**: app/api/admin/coupons/validate/route.ts
- **Bug**: Checks currentUses limit but never increments it
- **Impact**: Coupons can be reused unlimited times
- **Fix**: Add atomic increment after validation

### 5. Race Condition in Product Updates
- **File**: app/api/admin/products/[id]/route.ts:42-76
- **Bug**: Check-then-act without transaction (findUnique then update)
- **Impact**: Deleted products between check and update cause data inconsistency
- **Fix**: Use Prisma transaction

### 6. XSS in Email Templates
- **File**: app/api/admin/orders/[id]/route.ts:133
- **Bug**: Customer name/email directly interpolated: <p>Hi ${order.customerName}</p>
- **Attack**: customerName = "</p><script>alert(1)</script><p>"
- **Fix**: Use HTML escape utility or template escaping

---

## HIGH SEVERITY BUGS (6)

### 7. Missing Coupon Code Uniqueness Check on Update
- **File**: app/api/admin/coupons/[id]/route.ts:51-63
- **Bug**: Code field not validated for uniqueness when updating
- **Impact**: Could overwrite another coupon code
- **Fix**: Query for existing code before update

### 8. Missing Auth Middleware on /api/admin/me
- **File**: app/api/admin/me/route.ts:4
- **Bug**: No withAdminAuth wrapper (inconsistent with other endpoints)
- **Fix**: Wrap with withAdminAuth(handleGET)

### 9. Missing Row-Level Security in Analytics
- **File**: app/api/admin/analytics/route.ts:5
- **Bug**: All financial data returned to any authenticated admin
- **Impact**: Staff sees company-wide revenue they shouldn't
- **Fix**: Check admin role or permission

### 10. Insufficient Pagination Limit Hardcoding
- **File**: app/api/admin/orders/route.ts:11, customers/route.ts:10
- **Bug**: Max limit is 100, should be hardcoded lower
- **Risk**: DoS if validation changes
- **Fix**: Use hardcoded 50 instead of Math.min(100,...)

### 11. Nullable BasePrice in Financial Calculations
- **File**: app/api/admin/analytics/route.ts:157-160
- **Bug**: Assumes basePrice exists without null-safety
- **Impact**: Incorrect profit calculations
- **Fix**: Explicit null checks with ??

### 12. No Rate Limiting on Public Coupon Validation
- **File**: app/api/admin/coupons/validate/route.ts
- **Bug**: Public endpoint has no rate limiting
- **Risk**: Enumerate valid coupon codes via brute force
- **Fix**: Add strict rate limiting

---

## MEDIUM SEVERITY BUGS (8)

### 13. Admin Token Expiry Too Long
- **File**: lib/auth.ts:14
- **Bug**: TOKEN_EXPIRY = '7d' (too long)
- **Impact**: Stolen tokens valid for a week
- **Fix**: Change to '2h'

### 14. Client-Side Only File Type Validation
- **File**: app/api/admin/upload/route.ts:31, upload-cloudinary:30
- **Bug**: Validates MIME type without magic number check
- **Risk**: PHP file with MIME type "image/jpeg"
- **Fix**: Add magic number validation

### 15. Missing CSRF Protection
- **Files**: All admin write endpoints
- **Bug**: No CSRF tokens, relies only on SameSite cookies
- **Risk**: Bypass in older browsers
- **Fix**: Add CSRF token validation

### 16. JSON Parse Errors Return 500
- **File**: app/api/admin/products/route.ts:28
- **Bug**: Invalid JSON causes 500, should be 400
- **Fix**: Separate JSON parse error handling

### 17. Duplicate Rate Limit Implementations
- **Files**: lib/rate-limit.ts vs lib/upstash-rate-limit.ts
- **Bug**: Two different rate limit implementations
- **Fix**: Consolidate into single implementation

### 18. Missing Negative Stock Validation
- **File**: app/api/admin/products/[id]/route.ts:69
- **Bug**: stockQuantity not validated for < 0
- **Fix**: Add if (stockQuantity < 0) check

### 19. No Token Blacklist on Logout
- **File**: app/api/admin/auth/route.ts:70
- **Bug**: Logout clears cookie but no server blacklist
- **Risk**: Stolen tokens valid until expiry
- **Fix**: Implement Redis blacklist

### 20. Missing Coupon Date Range Validation
- **File**: app/api/admin/coupons/route.ts:82-83
- **Bug**: startDate can be after endDate
- **Fix**: if (startDate > endDate) return error

---

## LOW SEVERITY BUGS (5)

### 21. Loose Type Annotations
- **Files**: Multiple admin routes
- **Bug**: Using `error: any` instead of proper typing
- **Fix**: Use `catch (error: unknown)`

### 22. No Audit Logging
- **Files**: All admin write operations
- **Bug**: No record of who did what and when
- **Fix**: Create AdminAuditLog table

### 23. Silent Email Failures
- **File**: app/api/admin/orders/[id]/route.ts:174
- **Bug**: Email errors silently caught
- **Impact**: Admin doesn't know customer never got email
- **Fix**: Add emailSent flag to response

### 24. Hardcoded Cloudinary Folder
- **File**: app/api/admin/upload-cloudinary/route.ts:56
- **Bug**: folder: "flanagan-products" hardcoded
- **Fix**: Make configurable

### 25. Generic Error Messages Leak Details
- **Multiple**: All error handlers returning error.message
- **Bug**: Returns raw database/system errors to client
- **Fix**: Log internally, return generic message

---

## SUMMARY

CRITICAL: 6 issues - FIX IMMEDIATELY
HIGH: 6 issues - FIX BEFORE DEPLOY
MEDIUM: 8 issues - FIX SOON
LOW: 5 issues - ADDRESS IN SPRINT

TOTAL: 25 SECURITY & LOGIC BUGS

