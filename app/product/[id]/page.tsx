import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import ReviewSection from "@/components/ReviewSection";
import Footer from "@/components/Footer";
import { Review, ReviewStats } from "@/types/review";

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    const products = await res.json();
    return products.find((p: any) => p.id === id);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

// Sample reviews data
const sampleReviews: { [key: string]: Review[] } = {
  "1": [
    {
      id: "r1",
      productId: "1",
      userId: "u1",
      userName: "Jennifer M.",
      rating: 5,
      title: "Life-changing information!",
      comment: "This book opened my eyes to the importance of micro-organisms in health. Very well researched and easy to understand. Highly recommend for anyone interested in natural healing.",
      verified: true,
      helpful: 8,
      notHelpful: 0,
      createdAt: new Date("2025-09-20"),
    },
    {
      id: "r2",
      productId: "1",
      userId: "u2",
      userName: "David K.",
      rating: 5,
      title: "Excellent resource",
      comment: "Great book with practical advice. O'Neill really knows his stuff. Already implementing some of the strategies.",
      verified: true,
      helpful: 5,
      notHelpful: 0,
      createdAt: new Date("2025-09-15"),
    },
  ],
};

const sampleStats: { [key: string]: ReviewStats } = {
  "1": {
    averageRating: 4.8,
    totalReviews: 25,
    ratingDistribution: {
      5: 20,
      4: 3,
      3: 1,
      2: 1,
      1: 0,
    },
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--muted)]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <span>★</span>
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              <div className="mt-6">
                <span className="text-4xl font-bold">${product.price}</span>
              </div>

              <p className="mt-6 text-gray-600 dark:text-gray-400">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
              </div>

              <div className="mt-8 space-y-4 border-t border-[var(--border)] pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Availability:</span>
                  <span className="font-medium text-green-600">In Stock</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <ReviewSection
              productId={id}
              reviews={sampleReviews[id] || []}
              stats={sampleStats[id] || {
                averageRating: product.rating,
                totalReviews: product.reviews,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
