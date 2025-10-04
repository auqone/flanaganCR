# Sellery - Modern Ecommerce Platform

A clean, minimal, and robust ecommerce platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### ✨ Core Features
- **Responsive Design** - Mobile-first, works seamlessly on all devices
- **Advanced Filtering** - Robust left-side filtering system with multiple criteria
- **Shopping Cart** - Persistent cart with Zustand state management
- **Product Catalog** - Clean product grid with sorting and filtering
- **Product Details** - Comprehensive product pages with image galleries
- **Checkout Flow** - Complete checkout process with form validation
- **User Accounts** - Profile management and order history
- **Order Confirmation** - Professional order confirmation pages

### 🎨 Design
- Clean, minimal aesthetic
- Dark mode support
- Smooth animations and transitions
- High-quality product images
- Professional typography

### 🚀 Performance
- Server-side rendering with Next.js App Router
- Optimized images with Next.js Image component
- Fast page loads and smooth navigation
- SEO-optimized

### 📦 Dropshipping Ready
- Comprehensive supplier documentation
- API structure for supplier integration
- Automated inventory management ready
- Multi-supplier support planned

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sellery.git
cd sellery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Dropshipping Suppliers (add when ready)
SPOCKET_API_KEY=your_spocket_api_key
SPOCKET_WEBHOOK_SECRET=your_webhook_secret

# Database (add when implementing)
DATABASE_URL=your_database_url

# Authentication (add when implementing)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Payment Processing (add when implementing)
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sellery/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── products/       # Product API endpoints
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── product/[id]/       # Dynamic product pages
│   ├── account/            # User account page
│   ├── order-confirmation/ # Order confirmation
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── Header.tsx          # Site header with cart
│   ├── FilterSidebar.tsx   # Product filters
│   ├── ProductGrid.tsx     # Product grid display
│   └── AddToCartButton.tsx # Add to cart component
├── store/                   # State management
│   └── cartStore.ts        # Zustand cart store
├── lib/                     # Utility functions
│   └── types.ts            # TypeScript types
├── docs/                    # Documentation
│   └── DROPSHIPPING_SUPPLIERS.md  # Supplier guide
├── public/                  # Static assets
└── package.json            # Dependencies
```

## Pages

### Home (`/`)
- Product grid with filtering
- Left sidebar with category, price, brand filters
- Sorting options (featured, price, rating)
- Responsive design

### Product Detail (`/product/[id]`)
- Large product images
- Detailed descriptions
- Feature lists
- Add to cart with quantity selector
- Product specifications

### Cart (`/cart`)
- Cart item management
- Quantity adjustments
- Item removal
- Order summary with pricing breakdown
- Proceed to checkout

### Checkout (`/checkout`)
- Contact information form
- Shipping address form
- Payment information
- Order summary
- Form validation

### Account (`/account`)
- Profile management
- Order history
- Saved addresses
- Payment methods

## Customization

### Adding New Products

Products are currently stored in the API route. To add products:

1. Edit `app/api/products/route.ts`
2. Add product objects with required fields:
```typescript
{
  id: "unique-id",
  name: "Product Name",
  price: 99.99,
  image: "image-url",
  category: "Category",
  rating: 4.5,
  reviews: 100,
  description: "Description",
  inStock: true
}
```

### Customizing Filters

Edit `components/FilterSidebar.tsx` to modify filter categories and options.

### Styling

The design uses Tailwind CSS with custom CSS variables defined in `app/globals.css`. To customize colors:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --border: #e5e5e5;
  --muted: #f5f5f5;
  --accent: #000000;
}
```

## Dropshipping Integration

See [docs/DROPSHIPPING_SUPPLIERS.md](docs/DROPSHIPPING_SUPPLIERS.md) for detailed information on:
- Recommended suppliers
- Integration guides
- API setup
- Pricing strategies
- Quality control

### Quick Start with Spocket

1. Sign up at [spocket.co](https://www.spocket.co)
2. Get API credentials from dashboard
3. Add to `.env.local`:
```env
SPOCKET_API_KEY=your_api_key
```
4. Implement product sync (see supplier docs)

## Roadmap

### Phase 1 - MVP ✅
- [x] Project setup
- [x] Product catalog
- [x] Shopping cart
- [x] Checkout flow
- [x] Basic pages

### Phase 2 - Backend Integration
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real product data
- [ ] Order management
- [ ] Admin dashboard

### Phase 3 - User Features
- [ ] User authentication (NextAuth.js)
- [ ] User profiles
- [ ] Order tracking
- [ ] Wishlist functionality
- [ ] Product reviews

### Phase 4 - Payment & Fulfillment
- [ ] Stripe payment integration
- [ ] Spocket API integration
- [ ] Automated order fulfillment
- [ ] Inventory management
- [ ] Email notifications

### Phase 5 - Advanced Features
- [ ] Search functionality
- [ ] Advanced filtering with URL params
- [ ] Product recommendations
- [ ] Recently viewed items
- [ ] Sales and promotions
- [ ] Coupon codes

### Phase 6 - Optimization
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Analytics integration
- [ ] A/B testing
- [ ] Mobile app

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review supplier integration guides

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling
- Unsplash for placeholder images
- Dropshipping suppliers for making ecommerce accessible

---

**Built with ❤️ for modern ecommerce**
