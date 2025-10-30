# Flanagan Crafted Naturals - Login Credentials

## ⚠️ IMPORTANT: Database Setup Required First

The database tables need to be created in Supabase before these credentials will work.

### Step 1: Create Database Tables

1. Go to **https://supabase.com**
2. Click your **Tigerista** project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. **Copy and paste the contents of `setup-database.sql`**
6. Click **Run**
7. Wait for it to complete (you should see "Tables created successfully")

---

## Admin Login

Once the database is set up, use these credentials:

**URL:** `http://localhost:3000/admin/login`

**Email:** `admin@flanagan.com`
**Password:** `adminPassword123`

---

## Customer Login

**URL:** `http://localhost:3000/account` (after login redirect) or `http://localhost:3000/login`

**Email:** `customer@test.com`
**Password:** `customer123`

---

## Testing the App

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Admin Panel
- Go to `http://localhost:3000/admin/login`
- Enter admin credentials above
- You should see the **Flanagan Crafted Naturals** dashboard

### 3. Test Customer Frontend
- Go to `http://localhost:3000`
- Browse products
- Click "Add to Cart" to test shopping cart
- Try checkout flow (won't complete payment in dev without Stripe test keys)

### 4. Create New Credentials (Optional)

If you want to create additional admin or customer accounts:

```bash
node setup-credentials.js
```

(This requires the database to be accessible from your network)

---

## Troubleshooting

### "Can't reach database server" Error

If you get this error when trying to login:

1. **Check Supabase Status**
   - Go to https://supabase.com
   - Click Tigerista project
   - Look for **Project Status** - should be green ✅

2. **Check Database Connection**
   - Go to **Settings → Database**
   - Copy the connection string
   - Verify it matches `DATABASE_URL` in `.env`

3. **Check Network/Firewall**
   - Supabase might have IP restrictions
   - Go to **Settings → Network**
   - Add your current IP or disable restrictions temporarily

4. **Restart the Dev Server**
   ```bash
   npm run dev
   ```

---

## Changing Passwords

To change a password after logging in, use the admin dashboard or directly update the database:

```sql
UPDATE "Admin"
SET password = 'new_hashed_password'
WHERE email = 'admin@flanagan.com';
```

(Note: Passwords must be bcrypt-hashed. Use `bcryptjs` to hash them.)

---

## Next Steps

1. ✅ Create database tables (SQL script above)
2. ✅ Log in with admin credentials
3. ✅ Add products to the store
4. ✅ Test checkout flow
5. ✅ Set up Stripe integration for live payments
6. ✅ Deploy to production

---

Need help? Check the logs in the terminal where you ran `npm run dev`.
