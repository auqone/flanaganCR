"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    setAdded(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity:
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 rounded border border-[var(--border)] hover:bg-[var(--muted)]"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 rounded border border-[var(--border)] bg-transparent px-3 py-1 text-center text-sm"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-8 w-8 rounded border border-[var(--border)] hover:bg-[var(--muted)]"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full rounded-md bg-[var(--accent)] px-8 py-3 font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
      >
        {added ? "Added to Cart! ✓" : "Add to Cart"}
      </button>

      {added && (
        <Link
          href="/cart"
          className="w-full text-center rounded-md border border-[var(--accent)] px-8 py-3 font-medium text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors"
        >
          View Cart
        </Link>
      )}
    </div>
  );
}
