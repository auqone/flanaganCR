# Quick Start Guide - Sellery

Get your ecommerce store up and running in minutes!

## What You've Got

Sellery is a fully functional ecommerce platform with:

✅ **Beautiful Product Catalog** - Clean grid layout with high-quality images
✅ **Advanced Filtering** - Left sidebar with category, price, brand, rating filters
✅ **Shopping Cart** - Persistent cart that saves between sessions
✅ **Checkout Flow** - Complete checkout with forms and validation
✅ **Product Pages** - Detailed product information and images
✅ **User Account** - Profile and order management
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **Dark Mode** - Automatic dark/light theme switching

## Running the Application

The server is already running! 🎉

**Local URL:** http://localhost:3000
**Network URL:** http://192.168.0.37:3000

### Key Pages to Explore

1. **Home Page** (`/`)
   - Browse products with filtering and sorting
   - Click on any product to view details
   - Use the filter sidebar on desktop

2. **Product Detail** (`/product/1` or `/product/2`)
   - View detailed product information
   - Add items to cart with quantity selector
   - See product features and specifications

3. **Shopping Cart** (`/cart`)
   - View and manage cart items
   - Adjust quantities
   - See total pricing
   - Proceed to checkout

4. **Checkout** (`/checkout`)
   - Enter shipping information
   - Add payment details
   - Review order summary

5. **Account** (`/account`)
   - View profile information
   - See recent orders
   - Manage account settings

## Next Steps

### 1. Customize the Design (5 mins)

Edit `app/globals.css` to change colors:

```css
:root {
  --accent: #000000;  /* Change to your brand color */
}
```

### 2. Add Real Products (10 mins)

Edit `app/api/products/route.ts` and add your products:

```typescript
{
  id: "7",
  name: "Your Product Name",
  price: 99.99,
  image: "https://your-image-url.com/image.jpg",
  category: "Your Category",
  rating: 4.5,
  reviews: 50,
  description: "Your product description",
  inStock: true,
}
```

### 3. Set Up Dropshipping (30 mins)

1. Read `docs/DROPSHIPPING_SUPPLIERS.md`
2. Sign up at [Spocket.co](https://www.spocket.co)
3. Get your API key
4. Add to `.env.local`:
   ```
   SPOCKET_API_KEY=your_api_key
   ```

### 4. Add a Database (1 hour)

**Recommended: Supabase (Free tier available)**

```bash
npm install @supabase/supabase-js
```

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 5. Add Authentication (1 hour)

```bash
npm install next-auth
```

Follow the [NextAuth.js guide](https://next-auth.js.org/getting-started/example) for setup.

### 6. Add Payments (1 hour)

**Stripe Integration:**

```bash
npm install @stripe/stripe-js stripe
```

Sign up at [Stripe](https://stripe.com), get your API keys, and integrate checkout.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Testing Your Changes

1. Make changes to any file
2. Save the file
3. Next.js will automatically hot-reload
4. See changes instantly in your browser

## Common Customizations

### Change Site Name

Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "YourStore - Modern Ecommerce",
  description: "Your custom description",
};
```

And `components/Header.tsx`:
```tsx
<Link href="/" className="text-2xl font-bold tracking-tight">
  YourStore
</Link>
```

### Modify Filter Categories

Edit `components/FilterSidebar.tsx`:
```typescript
const filters: FilterSection[] = [
  {
    title: "Your Category",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  // Add more filter sections
];
```

### Update Product Grid

Edit `components/ProductGrid.tsx` to:
- Change grid columns
- Modify sorting options
- Adjust card styling

## Deployment

### Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables
6. Click "Deploy"

Your site will be live in ~2 minutes!

## Getting Help

- **Full Documentation:** See `README.md`
- **Supplier Guide:** See `docs/DROPSHIPPING_SUPPLIERS.md`
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

## Pro Tips

1. **Use the Network URL** to test on mobile devices on the same WiFi
2. **Check browser console** for any errors during development
3. **Use React DevTools** to inspect component state
4. **Keep the dev server running** while making changes
5. **Commit often** to save your progress

## Feature Roadmap

### Week 1
- [ ] Add your real products
- [ ] Customize colors and branding
- [ ] Test on mobile devices
- [ ] Set up Spocket account

### Week 2
- [ ] Integrate dropshipping supplier
- [ ] Add database for products
- [ ] Implement user authentication
- [ ] Set up Stripe payments

### Week 3
- [ ] Add email notifications
- [ ] Implement order tracking
- [ ] Add product search
- [ ] Create admin dashboard

### Week 4
- [ ] SEO optimization
- [ ] Performance testing
- [ ] Marketing setup
- [ ] Launch! 🚀

## Support

Need help? Have questions?

1. Check the documentation in `/docs`
2. Review the code comments
3. Search Next.js documentation
4. Join ecommerce communities on Reddit

---

**You're all set! Start customizing and building your awesome ecommerce store! 🎉**
