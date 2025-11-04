# Flanagan Crafted Naturals

An online apothecary serving up all-natural tinctures, jams, beard butters, and general wellness products.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT
- **Payment:** Stripe
- **Email:** Resend
- **Images:** Cloudinary
- **Deployment:** Vercel

## Features

### 🛍️ Customer Experience
- Product catalog with advanced filtering
- Shopping cart with persistent storage
- Complete checkout flow
- Order confirmation
- User accounts and order history
- Dark mode support
- Responsive mobile design

### 👨‍💼 Admin Dashboard
- Product management (CRUD)
- Order management with status tracking
- Customer management with search
- Email subscriber management
- Analytics and metrics
- Image uploads via Cloudinary

### 🔧 Backend
- 30+ API endpoints
- JWT authentication
- Email integration (Resend)
- Stripe webhook handling
- Rate limiting and middleware
- Database indexing for performance

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (DigitalOcean, Neon, Railway, etc.)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/auqone/flanaganCR.git
cd flanaganCR
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure `.env.local` with:
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Flanagan Crafted Naturals

# Authentication
NEXTAUTH_SECRET=generate_random_secret

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email (Resend)
RESEND_API_KEY=your_resend_key

# Images (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Admin Access

Default test credentials (development only):
- Email: admin@flanagan.com
- Password: adminPassword123

## Project Structure

```
├── app/
│   ├── api/                # API routes
│   ├── admin/              # Admin dashboard
│   ├── (shop)/             # Customer pages
│   └── layout.tsx          # Root layout
├── components/             # React components
├── lib/                    # Utilities (auth, db, logging)
├── prisma/                 # Database schema
├── store/                  # Zustand state management
└── docs/                   # Documentation
```

## License

MIT License

## Support

For issues or questions, open an issue on GitHub.
