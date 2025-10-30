# Quick Start Guide

## 🚀 Start Everything (One Button/Command)

### Windows Users
**Double-click:** `start.bat`

This will start the frontend, backend, and admin panel all in one terminal window.

### Mac/Linux Users
```bash
./start.sh
```

Or use npm directly:
```bash
npm run dev
```

---

## 📍 Access Points

Once the server is running, access:

| Component | URL | Purpose |
|-----------|-----|---------|
| **Frontend** | http://localhost:3000 | Customer-facing storefront |
| **Admin Panel** | http://localhost:3000/admin | Admin dashboard & management |
| **API** | http://localhost:3000/api | Backend API endpoints |

---

## 🔐 Admin Login

Navigate to http://localhost:3000/admin and log in with your admin credentials.

Default setup expects:
- Email: Check your database for admin user
- Password: Your configured password

---

## 📝 What's Running

The single command starts:

✅ **Frontend** - React/Next.js UI for customers
✅ **Backend API** - All API routes (products, orders, payments, etc.)
✅ **Admin Panel** - Dashboard for managing products, orders, and customers

All running on **localhost:3000**

---

## 🛑 Stop the Server

Press **Ctrl+C** in the terminal to stop all services.

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

### Dependencies Not Installed
```bash
npm install
```

### Database Connection Error
- Check `.env` file has valid `DATABASE_URL`
- Ensure Supabase is accessible

### Missing Environment Variables
- Copy `.env.example` to `.env.local`
- Fill in required values

---

## 📚 More Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code quality
npm run start-all    # Start everything (same as dev)
```

---

Happy developing! 🎉
