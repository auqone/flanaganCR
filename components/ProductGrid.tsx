"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  slashedPrice?: number;
  image: string;
  category: string;
  rating: number;
}

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
          <div className="flex items-center gap-2">
            {product.slashedPrice && product.slashedPrice > product.price && (
              <span className="text-sm font-medium text-gray-400 line-through">
                ${product.slashedPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-semibold text-green-600">${product.price.toFixed(2)}</span>
          </div>
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
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
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
