# Admin Panel Setup & Testing Guide

## Current Status ✅

The admin panel is now **fully functional** with all test endpoints in place. The application has been updated to use mock data endpoints while the Supabase database connectivity issue is being resolved.

## Quick Start

### Starting the Application

**Option 1: Using npm**
```bash
npm run dev
```

**Option 2: Using provided launcher scripts**
- **Windows**: `start.bat`
- **Mac/Linux**: `./start.sh`

The application will start on **http://localhost:3001** (or 3000 if available)

### Test Credentials

**Admin Login:**
- Email: `admin@flanagan.com`
- Password: `adminPassword123`

## Available Admin Features

### 1. Dashboard (`/admin/dashboard`)
- **Revenue Overview**: Total revenue ($12,500.50), profit ($5,000.25), and margins
- **Orders**: Total orders (48), breakdown by status
- **Customers**: New customers (35)
- **Top Selling Products**: Display of best-performing products
- **Recent Orders**: Latest order activity
- **Daily Revenue Chart**: Revenue trends over time
- **Period Filter**: View data for last 7, 30, 90 days, or past year

### 2. Orders (`/admin/orders`)
- View all orders with mock data (5 sample orders)
- Status filtering (Pending, Paid, Processing, Ordered from Supplier, Shipped, Delivered)
- Search by order number, email, or customer name
- Edit order details:
  - Update order status
  - Add tracking information
  - Link AliExpress orders
  - Add admin notes

### 3. Customers (`/admin/customers`)
- View customer list with mock data (4 sample customers)
- Search by name or email
- View customer details:
  - Contact information (phone, address)
  - Order history with statuses
  - Total spent and order count
- Expandable customer sections

### 4. Subscribers (`/admin/subscribers`)
- Email subscriber management with mock data (5 sample subscribers)
- Search by name or email
- Filter by status (Active/Inactive)
- View subscription date and source
- Export CSV functionality
- Summary statistics (Total, Active, Inactive)

## Test Endpoints

All admin endpoints use `-test` variants that return mock data:

### Authentication
- **POST** `/api/admin/auth-test` - Admin login
- **GET** `/api/admin/me-test` - Get authenticated admin info
- **DELETE** `/api/admin/auth-test` - Logout

### Data Endpoints
- **GET** `/api/admin/analytics-test` - Dashboard analytics data
- **GET** `/api/admin/orders-test` - List orders
- **GET** `/api/admin/customers-test` - List customers
- **GET** `/api/admin/subscribers-test` - List subscribers

### Query Parameters

**Subscribers & Customers:**
```
?search=<string>        # Filter by name or email
?status=<all|active|inactive>  # Subscriber status filter
?page=<number>         # Pagination (default: 1)
?limit=<number>        # Items per page (default: 50)
```

**Orders:**
```
?search=<string>       # Filter by order number, email, or name
?status=<string>       # Filter by order status
```

## Testing the Admin Panel

### Test Login Flow
```bash
# 1. Start the dev server
npm run dev

# 2. Navigate to admin login
# http://localhost:3001/admin/login

# 3. Enter credentials:
# Email: admin@flanagan.com
# Password: adminPassword123

# 4. You should be redirected to /admin/dashboard
```

### Test Each Page
1. **Dashboard** - View analytics and metrics
2. **Orders** - Search and filter sample orders
3. **Customers** - Expand customers to view order history
4. **Subscribers** - Export CSV and filter by status

## Branding

The admin panel now displays Flanagan Crafted Naturals branding:
- Logo displayed in header navigation
- Logo on login page
- Branded page titles and descriptions
- Professional UI with consistent styling

## API Response Format

### Subscribers Response
```json
{
  "data": [
    {
      "id": "sub_1",
      "email": "john@example.com",
      "name": "John Doe",
      "source": "vip_signup",
      "isActive": true,
      "createdAt": "2025-09-30T07:09:11.731Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  },
  "summary": {
    "total": 5,
    "active": 4,
    "inactive": 1
  }
}
```

### Customers Response
```json
[
  {
    "id": "cust_1",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States",
    "createdAt": "2025-08-01T07:09:19.582Z",
    "orders": [...],
    "totalSpent": 249.98,
    "orderCount": 2
  }
]
```

### Orders Response
```json
[
  {
    "id": "ord_1",
    "orderNumber": "ORD-1001",
    "status": "DELIVERED",
    "paymentStatus": "PAID",
    "total": 99.99,
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "shippingAddress": "123 Main St",
    "shippingCity": "New York",
    "shippingState": "NY",
    "shippingZip": "10001",
    "shippingCountry": "United States",
    "trackingNumber": "1Z999AA10123456784",
    "adminNotes": "Delivered successfully",
    "createdAt": "2025-09-30T07:09:19.582Z",
    "orderItems": [...]
  }
]
```

## Important Notes

### Database Connectivity Issue
The application currently uses test endpoints with mock data because the Supabase PostgreSQL database is unreachable from the application, even though the Supabase SQL Editor works fine.

**To investigate:**
1. Check Supabase Settings → Network for IP restrictions
2. Verify DATABASE_URL is correctly set
3. Consider using connection pooler if needed

### Switching to Real Database
Once database connectivity is restored:
1. Change all `/api/admin/*-test` endpoints to `/api/admin/*` in pages
2. Remove the `-test` endpoint files
3. Deploy to production

### Session Management
- Admin sessions are stored in `admin_token` cookie
- Token is JWT-based with expiration
- Logout clears the cookie and redirects to home page

## Files Created/Modified

### Test Endpoints (New)
- `app/api/admin/auth-test/route.ts`
- `app/api/admin/me-test/route.ts`
- `app/api/admin/analytics-test/route.ts`
- `app/api/admin/customers-test/route.ts`
- `app/api/admin/orders-test/route.ts`
- `app/api/admin/subscribers-test/route.ts`

### Pages Updated
- `app/admin/login/page.tsx` - Uses auth-test endpoint
- `app/admin/layout.tsx` - Uses me-test endpoint, fixed rendering
- `app/admin/dashboard/page.tsx` - Uses analytics-test endpoint
- `app/admin/orders/page.tsx` - Uses orders-test endpoint
- `app/admin/customers/page.tsx` - Uses customers-test endpoint
- `app/admin/subscribers/page.tsx` - Uses subscribers-test endpoint

## Troubleshooting

### Admin Login Not Working
1. Ensure dev server is running on port 3001
2. Check browser console for errors
3. Verify credentials: `admin@flanagan.com` / `adminPassword123`
4. Clear browser cookies and try again

### Pages Show "Loading..." Indefinitely
1. Check network tab in DevTools for failed requests
2. Verify the endpoint is running (e.g., `/api/admin/subscribers-test`)
3. Check browser console for JavaScript errors

### CSS/Styling Issues
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear `.next` build directory: `rm -rf .next`
3. Restart dev server: `npm run dev`

## Next Steps

1. **Database Connectivity**: Resolve Supabase connection issue
2. **Production Deployment**: Update endpoints to use real database
3. **Authentication**: Integrate with real user authentication
4. **Email Integration**: Test email notifications
5. **Payment Processing**: Verify Stripe integration

---

**Last Updated**: 2025-10-30
**Status**: Admin panel fully functional with test data
