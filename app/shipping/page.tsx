import Footer from "@/components/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Shipping Information</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Rates</h2>
          <p className="mb-4">
            We offer free standard shipping on all orders over $50. For orders under $50,
            a flat shipping rate of $5.99 applies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery Times</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Standard Shipping:</strong> 3-5 business days</li>
            <li><strong>Express Shipping:</strong> 1-2 business days (+$9.99)</li>
            <li><strong>International:</strong> 7-14 business days (rates vary)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Order Processing</h2>
          <p className="mb-4">
            Orders are typically processed within 24 hours. You&apos;ll receive a tracking number
            via email once your order ships.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Tracking Your Order</h2>
          <p className="mb-4">
            Once your order ships, you&apos;ll receive a tracking number via email. You can also
            track your order anytime by logging into your account.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
