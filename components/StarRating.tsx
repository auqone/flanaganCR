"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);
          const isPartial = starValue > Math.floor(rating) && starValue <= Math.ceil(rating);
          const partialFill = isPartial ? ((rating % 1) * 100) : 0;

          return (
            <div
              key={index}
              className={`relative ${interactive ? "cursor-pointer" : ""}`}
              onClick={() => handleClick(starValue)}
            >
              {isPartial ? (
                <>
                  <Star className={`${sizeClasses[size]} text-gray-300`} />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${partialFill}%` }}
                  >
                    <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
                  </div>
                </>
              ) : (
                <Star
                  className={`${sizeClasses[size]} ${
                    isFilled
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } ${interactive ? "hover:fill-yellow-300 hover:text-yellow-300" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
