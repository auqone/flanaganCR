# Flanagan Crafted Naturals - Admin Panel Quick Start

## Start the Admin Panel

```bash
npm run dev
# Opens on http://localhost:3001
```

## Admin Login

- **URL**: http://localhost:3001/admin/login
- **Email**: admin@flanagan.com
- **Password**: adminPassword123

## What You Can Do

| Page | Features |
|------|----------|
| **Dashboard** | View analytics, revenue, orders, customers, top products, daily charts |
| **Orders** | Search, filter, and manage customer orders with tracking & notes |
| **Customers** | View customer info, contact details, and order history |
| **Subscribers** | Manage email list, filter by status, export CSV |

## Test Endpoints

All admin features use `-test` endpoints with mock data:

```
GET  /api/admin/analytics-test   → Dashboard data
GET  /api/admin/orders-test      → Order list
GET  /api/admin/customers-test   → Customer list
GET  /api/admin/subscribers-test → Subscriber list
POST /api/admin/auth-test        → Login
GET  /api/admin/me-test          → Get current admin
```

## Sample Data Included

- 5 sample orders (various statuses)
- 4 sample customers (with order history)
- 5 sample subscribers (active & inactive)
- Daily revenue data
- Top product analytics

## Important

⚠️ These are **test endpoints with mock data**. They're in place while we resolve Supabase database connectivity. Once the database is accessible, we'll switch back to real endpoints.

## Files

- `ADMIN_PANEL_SETUP.md` - Detailed setup & troubleshooting guide
- `QUICK_START.md` - General project quick start
- `CREDENTIALS.md` - Credential management guide

## Need Help?

1. Check `ADMIN_PANEL_SETUP.md` for detailed documentation
2. Check browser console (F12) for error messages
3. Ensure dev server is running: `npm run dev`
4. Clear cookies and try login again if issues persist
