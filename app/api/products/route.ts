import { NextResponse } from "next/server";

// Hot AliExpress trending products for 2025 - in production, this would come from a database
const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds Pro",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.7,
    reviews: 2847,
    description: "Top-selling wireless earbuds with seamless connectivity, deep bass, and 24-hour battery life. Perfect for music lovers aged 18-35.",
    inStock: true,
  },
  {
    id: "2",
    name: "Fitness Tracker Smart Watch",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.6,
    reviews: 1923,
    description: "Must-have fitness tracker with heart rate monitoring, sleep tracking, and 7-day battery. Ideal for health enthusiasts aged 25-50.",
    inStock: true,
  },
  {
    id: "3",
    name: "Portable Electric Lunch Box",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop",
    category: "Home & Kitchen",
    rating: 4.5,
    reviews: 1456,
    description: "Highly trending electric lunch box that heats your meal anywhere. Perfect for office workers and students.",
    inStock: true,
  },
  {
    id: "4",
    name: "Home Walking Pad Treadmill",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.8,
    reviews: 3421,
    description: "Ultra-popular compact walking pad perfect for home offices. Interest has skyrocketed over the past two years!",
    inStock: true,
  },
  {
    id: "5",
    name: "Rain Cloud Aroma Diffuser",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.7,
    reviews: 2156,
    description: "Mesmerizing water drip design creates calming vibes. Prime for TikTok and Instagram content!",
    inStock: true,
  },
  {
    id: "6",
    name: "Resistance Bands Set (5pcs)",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.6,
    reviews: 1678,
    description: "Fitness staple for home workouts and rehab. Lightweight, packable, and cheap shipping costs make it a winner.",
    inStock: true,
  },
  {
    id: "7",
    name: "Mini Thermal Printer",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 1234,
    description: "Viral on TikTok! Compact printer for stickers, labels, and checklists. Popular with students and journaling enthusiasts.",
    inStock: true,
  },
  {
    id: "8",
    name: "Yoga Exercise Mat Premium",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.4,
    reviews: 2891,
    description: "Top seller thanks to the booming home workout trend. Yoga mat market set to hit $17.3 billion by 2025!",
    inStock: true,
  },
  {
    id: "9",
    name: "Waterproof Mattress Cover",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.6,
    reviews: 1987,
    description: "Currently one of the best sellers on AliExpress. Clearly fulfilling a significant market need for mattress protection.",
    inStock: true,
  },
  {
    id: "10",
    name: "Compression Socks (3 Pairs)",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.5,
    reviews: 1543,
    description: "Can be marketed in multiple niches: sports apparel, medical, and fashion. Potential profit of $7+",
    inStock: true,
  },
  {
    id: "11",
    name: "Cat Scratching Pad Lounge",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
    category: "Pet Supplies",
    rating: 4.7,
    reviews: 2345,
    description: "Satisfies cats' natural scratching instincts. Interest has been steadily increasing over the past decade!",
    inStock: true,
  },
  {
    id: "12",
    name: "Personalized Photo Necklace",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.8,
    reviews: 3156,
    description: "Customize with photos, text, or logos. Perfect for Christmas and Valentine's Day gifting!",
    inStock: true,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  // Sort products
  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json(filteredProducts);
}
