import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import ReviewSection from "@/components/ReviewSection";
import Footer from "@/components/Footer";
import { Review, ReviewStats } from "@/types/review";

// Hot AliExpress trending products for 2025 - matches ProductGrid
const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds Pro",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.7,
    reviews: 2847,
    description: "Top-selling wireless earbuds with seamless connectivity, deep bass, and 24-hour battery life. Perfect for music lovers aged 18-35.",
    features: [
      "Bluetooth 5.0 connectivity",
      "24-hour battery life with charging case",
      "Deep bass and crystal-clear audio",
      "IPX5 water resistant",
      "Touch controls",
    ],
    inStock: true,
  },
  {
    id: "2",
    name: "Fitness Tracker Smart Watch",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.6,
    reviews: 1923,
    description: "Must-have fitness tracker with heart rate monitoring, sleep tracking, and 7-day battery. Ideal for health enthusiasts aged 25-50.",
    features: [
      "Heart rate monitoring 24/7",
      "Sleep quality tracking",
      "7-day battery life",
      "100+ sport modes",
      "Water resistant up to 50m",
    ],
    inStock: true,
  },
  {
    id: "3",
    name: "Portable Electric Lunch Box",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=800&fit=crop",
    category: "Home & Kitchen",
    rating: 4.5,
    reviews: 1456,
    description: "Highly trending electric lunch box that heats your meal anywhere. Perfect for office workers and students.",
    features: [
      "Heats food in 15-20 minutes",
      "Removable stainless steel container",
      "110V and 12V car adapter included",
      "1.5L capacity",
      "BPA-free materials",
    ],
    inStock: true,
  },
  {
    id: "4",
    name: "Home Walking Pad Treadmill",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=800&fit=crop",
    category: "Sports & Fitness",
    rating: 4.8,
    reviews: 3421,
    description: "Ultra-popular compact walking pad perfect for home offices. Interest has skyrocketed over the past two years!",
    features: [
      "Ultra-slim 5-inch profile",
      "0.5-6 km/h walking speed",
      "LED display with remote control",
      "Quiet motor under 50dB",
      "Supports up to 220 lbs",
    ],
    inStock: true,
  },
  {
    id: "5",
    name: "Rain Cloud Aroma Diffuser",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=800&fit=crop",
    category: "Home & Garden",
    rating: 4.7,
    reviews: 2156,
    description: "Mesmerizing water drip design creates calming vibes. Prime for TikTok and Instagram content!",
    features: [
      "Unique rain cloud design",
      "300ml water capacity",
      "7 LED color options",
      "Auto shut-off safety feature",
      "Whisper-quiet operation",
    ],
    inStock: true,
  },
  {
    id: "6",
    name: "Resistance Bands Set (5pcs)",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop",
    category: "Sports & Fitness",
    rating: 4.6,
    reviews: 1678,
    description: "Fitness staple for home workouts and rehab. Lightweight, packable, and cheap shipping costs make it a winner.",
    features: [
      "5 resistance levels (10-50 lbs)",
      "Natural latex material",
      "Includes door anchor and handles",
      "Portable carry bag",
      "Workout guide included",
    ],
    inStock: true,
  },
  {
    id: "7",
    name: "Mini Thermal Printer",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.5,
    reviews: 1234,
    description: "Viral on TikTok! Compact printer for stickers, labels, and checklists. Popular with students and journaling enthusiasts.",
    features: [
      "Bluetooth wireless printing",
      "2-3 hour battery life",
      "300 DPI resolution",
      "Compatible with iOS and Android",
      "Inkless thermal printing",
    ],
    inStock: true,
  },
  {
    id: "8",
    name: "Yoga Exercise Mat Premium",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop",
    category: "Sports & Fitness",
    rating: 4.4,
    reviews: 2891,
    description: "Top seller thanks to the booming home workout trend. Yoga mat market set to hit $17.3 billion by 2025!",
    features: [
      "6mm extra thick cushioning",
      "Non-slip textured surface",
      "72 x 24 inch size",
      "Eco-friendly TPE material",
      "Includes carrying strap",
    ],
    inStock: true,
  },
  {
    id: "9",
    name: "Waterproof Mattress Cover",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop",
    category: "Home & Garden",
    rating: 4.6,
    reviews: 1987,
    description: "Currently one of the best sellers on AliExpress. Clearly fulfilling a significant market need for mattress protection.",
    features: [
      "100% waterproof barrier",
      "Breathable and noiseless",
      "Hypoallergenic protection",
      "Deep pocket fits up to 18 inches",
      "Machine washable",
    ],
    inStock: true,
  },
  {
    id: "10",
    name: "Compression Socks (3 Pairs)",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&h=800&fit=crop",
    category: "Health & Wellness",
    rating: 4.5,
    reviews: 1543,
    description: "Can be marketed in multiple niches: sports apparel, medical, and fashion. Potential profit of $7+",
    features: [
      "20-30 mmHg compression",
      "Moisture-wicking fabric",
      "Arch support",
      "Available in multiple sizes",
      "Reduces swelling and fatigue",
    ],
    inStock: true,
  },
  {
    id: "11",
    name: "Cat Scratching Pad Lounge",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&h=800&fit=crop",
    category: "Home & Garden",
    rating: 4.7,
    reviews: 2345,
    description: "Satisfies cats' natural scratching instincts. Interest has been steadily increasing over the past decade!",
    features: [
      "Curved lounge design",
      "Durable corrugated cardboard",
      "Includes catnip",
      "Reversible for extended use",
      "Protects furniture",
    ],
    inStock: true,
  },
  {
    id: "12",
    name: "Personalized Photo Necklace",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    category: "Jewelry & Accessories",
    rating: 4.8,
    reviews: 3156,
    description: "Customize with photos, text, or logos. Perfect for Christmas and Valentine's Day gifting!",
    features: [
      "Stainless steel chain",
      "Water resistant",
      "Custom photo projection",
      "Adjustable 18-22 inch chain",
      "Gift box included",
    ],
    inStock: true,
  },
];

// Sample reviews data
const sampleReviews: { [key: string]: Review[] } = {
  "1": [
    {
      id: "r1",
      productId: "1",
      userId: "u1",
      userName: "Sarah Johnson",
      rating: 5,
      title: "Best earbuds I've ever owned!",
      comment: "The sound quality is incredible and they fit perfectly. Battery life is exactly as advertised. Highly recommend!",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop"],
      verified: true,
      helpful: 24,
      notHelpful: 2,
      createdAt: new Date("2025-09-15"),
    },
    {
      id: "r2",
      productId: "1",
      userId: "u2",
      userName: "Mike Chen",
      rating: 4,
      title: "Great value for money",
      comment: "Very good earbuds for the price. Only minor complaint is they sometimes slip out during intense workouts.",
      verified: true,
      helpful: 12,
      notHelpful: 1,
      createdAt: new Date("2025-09-10"),
    },
  ],
};

const sampleStats: { [key: string]: ReviewStats } = {
  "1": {
    averageRating: 4.7,
    totalReviews: 2847,
    ratingDistribution: {
      5: 2100,
      4: 550,
      3: 150,
      2: 35,
      1: 12,
    },
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--muted)]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <span>★</span>
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              <div className="mt-6">
                <span className="text-4xl font-bold">${product.price}</span>
              </div>

              <p className="mt-6 text-gray-600 dark:text-gray-400">
                {product.description}
              </p>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
              </div>

              <div className="mt-8 space-y-4 border-t border-[var(--border)] pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Availability:</span>
                  <span className="font-medium text-green-600">In Stock</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <ReviewSection
              productId={id}
              reviews={sampleReviews[id] || []}
              stats={sampleStats[id] || {
                averageRating: product.rating,
                totalReviews: product.reviews,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
