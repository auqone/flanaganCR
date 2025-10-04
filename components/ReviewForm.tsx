"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import StarRating from "./StarRating";

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: any) => void;
}

export default function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const review = {
      productId,
      rating,
      title,
      comment,
      images,
      createdAt: new Date(),
    };

    await onSubmit(review);

    // Reset form
    setRating(0);
    setTitle("");
    setComment("");
    setImages([]);
    setIsSubmitting(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In production, upload to storage service
      // For now, just create object URLs
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-[var(--border)] rounded-lg p-6">
      <h3 className="text-xl font-semibold">Write a Review</h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating *</label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium mb-2">
          Review Title *
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience in one line"
          className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          required
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
          Your Review *
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what you think about this product"
          rows={5}
          className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          required
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Add Photos (Optional)</label>
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20 rounded overflow-hidden">
              <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <label className="w-20 h-20 border-2 border-dashed border-[var(--border)] rounded flex items-center justify-center cursor-pointer hover:border-[var(--accent)] transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="h-6 w-6 text-gray-400" />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">You can upload up to 5 photos</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!rating || !title || !comment || isSubmitting}
        className="w-full rounded-md bg-[var(--accent)] px-8 py-3 font-medium text-[var(--background)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
