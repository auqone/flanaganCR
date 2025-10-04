"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would process the payment
    clearCart();
    router.push("/order-confirmation");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (items.length === 0) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to checkout!</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="rounded-lg border border-[var(--border)] p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[var(--border)] p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[var(--border)] p-6">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        required
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                className="w-full rounded-md bg-[var(--accent)] px-8 py-3 font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-[var(--border)] p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-[var(--border)] pt-4">
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
