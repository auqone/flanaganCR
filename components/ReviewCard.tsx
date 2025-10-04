"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, CheckCircle, Play } from "lucide-react";
import StarRating from "./StarRating";
import { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [notHelpful, setNotHelpful] = useState(review.notHelpful);
  const [voted, setVoted] = useState<"helpful" | "not-helpful" | null>(null);

  const handleVote = (type: "helpful" | "not-helpful") => {
    if (voted === type) {
      // Undo vote
      if (type === "helpful") {
        setHelpful(helpful - 1);
      } else {
        setNotHelpful(notHelpful - 1);
      }
      setVoted(null);
    } else {
      // New vote or change vote
      if (voted === "helpful") {
        setHelpful(helpful - 1);
        setNotHelpful(notHelpful + 1);
      } else if (voted === "not-helpful") {
        setNotHelpful(notHelpful - 1);
        setHelpful(helpful + 1);
      } else {
        if (type === "helpful") {
          setHelpful(helpful + 1);
        } else {
          setNotHelpful(notHelpful + 1);
        }
      }
      setVoted(type);
    }
  };

  return (
    <div className="border border-[var(--border)] rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--background)] font-semibold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.userName}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <StarRating rating={review.rating} size="sm" />
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div>
        <h4 className="font-semibold mb-2">{review.title}</h4>
        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
      </div>

      {/* Media */}
      {(review.images || review.videos) && (
        <div className="flex gap-2 flex-wrap">
          {review.images?.map((image, index) => (
            <div key={`img-${index}`} className="relative w-20 h-20 rounded overflow-hidden">
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {review.videos?.map((video, index) => (
            <div
              key={`vid-${index}`}
              className="relative w-20 h-20 rounded overflow-hidden bg-black flex items-center justify-center cursor-pointer"
            >
              <Play className="h-8 w-8 text-white" />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Buttons */}
      <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)]">
        <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>
        <button
          onClick={() => handleVote("helpful")}
          className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition-colors ${
            voted === "helpful"
              ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
              : "border-[var(--border)] hover:border-green-500 hover:text-green-600"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes ({helpful})
        </button>
        <button
          onClick={() => handleVote("not-helpful")}
          className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition-colors ${
            voted === "not-helpful"
              ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
              : "border-[var(--border)] hover:border-red-500 hover:text-red-600"
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          No ({notHelpful})
        </button>
      </div>
    </div>
  );
}
