import Footer from "@/components/Footer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Returns & Exchanges</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <h2 className="text-2xl font-semibold mt-8 mb-4">30-Day Return Policy</h2>
          <p className="mb-4">
            We offer a 30-day return policy on most items. If you&apos;re not completely satisfied
            with your purchase, you can return it within 30 days of delivery for a full refund.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Return Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Items must be unused and in original packaging</li>
            <li>All tags and labels must be attached</li>
            <li>Include your order number with your return</li>
            <li>Items must be returned within 30 days of delivery</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Return</h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Contact our support team at support@sellery.com</li>
            <li>Receive your return authorization and shipping label</li>
            <li>Pack the item securely with original packaging</li>
            <li>Ship the package using the provided label</li>
            <li>Receive your refund within 5-7 business days</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Exchanges</h2>
          <p className="mb-4">
            We&apos;re happy to exchange items for a different size or color. Contact us at
            support@sellery.com to arrange an exchange.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Return Shipping</h2>
          <p className="mb-4">
            Return shipping is free for defective or incorrect items. For other returns,
            a $5.99 return shipping fee will be deducted from your refund.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
