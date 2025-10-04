import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last updated: October 1, 2025</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account,
            place an order, or contact customer service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your questions and requests</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our products and services</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your information with service
            providers who help us operate our business, such as payment processors and shipping companies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
          <p className="mb-4">
            We use industry-standard security measures to protect your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. Contact
            us at privacy@sellery.com to exercise these rights.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at privacy@sellery.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
