"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

// Hot AliExpress trending products for 2025
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds Pro",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.7,
  },
  {
    id: "2",
    name: "Fitness Tracker Smart Watch",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Portable Electric Lunch Box",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop",
    category: "Home & Kitchen",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Home Walking Pad Treadmill",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.8,
  },
  {
    id: "5",
    name: "Rain Cloud Aroma Diffuser",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.7,
  },
  {
    id: "6",
    name: "Resistance Bands Set (5pcs)",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.6,
  },
  {
    id: "7",
    name: "Mini Thermal Printer",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.5,
  },
  {
    id: "8",
    name: "Yoga Exercise Mat Premium",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.4,
  },
  {
    id: "9",
    name: "Waterproof Mattress Cover",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.6,
  },
  {
    id: "10",
    name: "Compression Socks (3 Pairs)",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop",
    category: "Health & Wellness",
    rating: 4.5,
  },
  {
    id: "11",
    name: "Cat Scratching Pad Lounge",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.7,
  },
  {
    id: "12",
    name: "Personalized Photo Necklace",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    category: "Jewelry & Accessories",
    rating: 4.8,
  },
  {
    id: "13",
    name: "LED Ring Light with Tripod",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.6,
  },
  {
    id: "14",
    name: "USB-C Hub 7-in-1 Adapter",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
    category: "Electronics & Gadgets",
    rating: 4.5,
  },
  {
    id: "15",
    name: "Adjustable Dumbbells Set",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.7,
  },
  {
    id: "16",
    name: "Foam Roller Massage Tool",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1591940742878-13aba4b7a34e?w=400&h=400&fit=crop",
    category: "Sports & Fitness",
    rating: 4.4,
  },
  {
    id: "17",
    name: "Stainless Steel Cookware Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1584990347449-39b4aa02c38a?w=400&h=400&fit=crop",
    category: "Home & Kitchen",
    rating: 4.6,
  },
  {
    id: "18",
    name: "Air Fryer 6-Quart Digital",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    category: "Home & Kitchen",
    rating: 4.8,
  },
  {
    id: "19",
    name: "Raised Garden Bed Kit",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.5,
  },
  {
    id: "20",
    name: "Solar Powered Garden Lights",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop",
    category: "Home & Garden",
    rating: 4.3,
  },
  {
    id: "21",
    name: "Vitamin D3 Supplement 5000IU",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1550572017-4fade6d5221d?w=400&h=400&fit=crop",
    category: "Health & Wellness",
    rating: 4.7,
  },
  {
    id: "22",
    name: "Acupressure Mat and Pillow",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop",
    category: "Health & Wellness",
    rating: 4.5,
  },
  {
    id: "23",
    name: "Essential Oil Diffuser Bracelet",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    category: "Health & Wellness",
    rating: 4.4,
  },
  {
    id: "24",
    name: "Sterling Silver Hoop Earrings",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    category: "Jewelry & Accessories",
    rating: 4.8,
  },
  {
    id: "25",
    name: "Layered Chain Necklace Set",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop",
    category: "Jewelry & Accessories",
    rating: 4.6,
  },
  {
    id: "26",
    name: "Minimalist Watch Rose Gold",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    category: "Jewelry & Accessories",
    rating: 4.7,
  },
  {
    id: "27",
    name: "Photography Lightroom Presets",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop",
    category: "Digital Products",
    rating: 4.9,
  },
  {
    id: "28",
    name: "Social Media Template Bundle",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
    category: "Digital Products",
    rating: 4.8,
  },
  {
    id: "29",
    name: "Fitness Workout Plan eBook",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop",
    category: "Digital Products",
    rating: 4.7,
  },
  {
    id: "30",
    name: "Budget Planner Spreadsheet",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
    category: "Digital Products",
    rating: 4.6,
  },
];

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium line-clamp-2 hover:underline">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <span>★</span>
          <span>{product.rating}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold">${product.price}</span>
          <button
            onClick={handleAddToCart}
            className="rounded bg-green-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({
  categoryFilter,
  priceFilter,
  ratingFilter
}: {
  categoryFilter: string | null;
  priceFilter: string | null;
  ratingFilter: string | null;
}) {
  let filteredProducts = products;

  // Category filter
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter((product) => product.category === categoryFilter);
  }

  // Price filter
  if (priceFilter) {
    filteredProducts = filteredProducts.filter((product) => {
      const price = product.price;
      if (priceFilter === "Under $25") return price < 25;
      if (priceFilter === "$25 - $50") return price >= 25 && price <= 50;
      if (priceFilter === "$50 - $100") return price > 50 && price <= 100;
      if (priceFilter === "$100 - $200") return price > 100 && price <= 200;
      if (priceFilter === "Over $200") return price > 200;
      return true;
    });
  }

  // Rating filter
  if (ratingFilter) {
    filteredProducts = filteredProducts.filter((product) => {
      const rating = product.rating;
      if (ratingFilter === "4+ Stars") return rating >= 4;
      if (ratingFilter === "3+ Stars") return rating >= 3;
      if (ratingFilter === "2+ Stars") return rating >= 2;
      if (ratingFilter === "1+ Stars") return rating >= 1;
      return true;
    });
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {categoryFilter || "All Products"}
        </h1>
        <select className="rounded-md border border-[var(--border)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
          <option>Best Rating</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
