import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">About Sellery</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p className="text-lg mb-4">
            Welcome to Sellery - your destination for quality products at great prices.
          </p>
          <p className="mb-4">
            We&apos;re passionate about bringing you the best products from around the world,
            with fast shipping and exceptional customer service.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            To make online shopping easy, affordable, and enjoyable for everyone.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Curated selection of trending products</li>
            <li>Fast, reliable shipping</li>
            <li>30-day return policy</li>
            <li>Secure checkout</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
