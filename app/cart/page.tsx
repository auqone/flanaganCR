"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Trash2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/"
            className="rounded-md bg-[var(--accent)] px-8 py-3 font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-[var(--border)] p-4"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded bg-[var(--muted)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-600">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 rounded border border-[var(--border)] hover:bg-[var(--muted)]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 rounded border border-[var(--border)] hover:bg-[var(--muted)]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-sm text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-[var(--border)] p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="my-4 border-t border-[var(--border)]" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-md bg-[var(--accent)] px-8 py-3 text-center font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="mt-4 block text-center text-sm text-gray-600 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
