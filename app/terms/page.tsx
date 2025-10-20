import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last updated: October 1, 2025</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
          <p className="mb-4">
            By accessing and using this website, you agree to be bound by these Terms of Service and all
            applicable laws and regulations.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily use this website for personal, non-commercial use only.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Product Information</h2>
          <p className="mb-4">
            We strive to provide accurate product information, but we do not warrant that product
            descriptions or other content is accurate, complete, reliable, or error-free.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing</h2>
          <p className="mb-4">
            Prices are subject to change without notice. We reserve the right to refuse or cancel
            any order placed for a product listed at an incorrect price.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Terms</h2>
          <p className="mb-4">
            Payment is due at the time of purchase. We accept major credit cards and other payment
            methods as indicated at checkout.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping and Delivery</h2>
          <p className="mb-4">
            Delivery times are estimates only. We are not responsible for delays caused by shipping
            carriers or customs.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
          <p className="mb-4">
            We shall not be liable for any indirect, incidental, special, or consequential damages
            arising from your use of the site or products purchased.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="mb-4">
            Questions about these Terms should be sent to legal@example.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
