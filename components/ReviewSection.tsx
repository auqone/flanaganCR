"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { Review, ReviewStats } from "@/types/review";

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  stats: ReviewStats;
}

export default function ReviewSection({ productId, reviews: initialReviews, stats }: ReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent");
  const [showForm, setShowForm] = useState(false);

  const handleReviewSubmit = async (newReview: any) => {
    // In production, send to API
    const review: Review = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      images: newReview.images,
      verified: false,
      helpful: 0,
      notHelpful: 0,
      createdAt: newReview.createdAt,
      productId,
    };

    setReviews([review, ...reviews]);
    setShowForm(false);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="space-y-8">
      {/* Overall Rating */}
      <div className="border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold mb-2">{stats.averageRating.toFixed(1)}</div>
            <StarRating rating={stats.averageRating} size="lg" />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on {stats.totalReviews} reviews
            </div>
          </div>

          {/* Right: Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star as keyof typeof stats.ratingDistribution];
              const percentage = (count / stats.totalReviews) * 100;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{star} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-md border-2 border-[var(--accent)] px-8 py-3 font-medium text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div>
          <ReviewForm productId={productId} onSubmit={handleReviewSubmit} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--accent)]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Sort and Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{reviews.length} Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-md border border-[var(--border)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
