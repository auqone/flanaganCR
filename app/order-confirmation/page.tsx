"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

export default function OrderConfirmationPage() {
  const { clearCart } = useCartStore();
  const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  useEffect(() => {
    // Clear cart on successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-gray-500 mb-8">
          Order number: <span className="font-mono font-medium">{orderNumber}</span>
        </p>

        <div className="rounded-lg border border-[var(--border)] p-6 mb-8 text-left">
          <h2 className="font-semibold mb-2">What&apos;s next?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• You&apos;ll receive a confirmation email shortly</li>
            <li>• Track your order in your account</li>
            <li>• Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full rounded-md bg-[var(--accent)] px-8 py-3 font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="w-full rounded-md border border-[var(--border)] px-8 py-3 font-medium hover:bg-[var(--muted)] transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
