"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Review } from '@/libs/types';
import StarRating from "./StarRating";
import ActionButtons from "./ActionButtons";

interface ReviewData {
  rating: number;
  reviewText: string;
}

interface ReviewFormModalProps {
  isOpen?: boolean;
  initialReview?: Review | null;
  onSubmit?: (data: ReviewData) => void;
  onCancel?: () => void;
  bookingId?: string;
}

export default function ReviewFormModal({ isOpen, initialReview, onSubmit, onCancel, bookingId }: ReviewFormModalProps) {
  const [rating, setRating] = useState<number>(initialReview?.rating ?? 5);
  const [reviewText, setReviewText] = useState<string>(initialReview?.comment ?? "");

  useEffect(() => {
    setRating(initialReview?.rating ?? 5);
    setReviewText(initialReview?.comment ?? "");
  }, [initialReview]);

  if (!isOpen) return null;

  const handleConfirm = (): void => {
    onSubmit?.({ rating, reviewText });
  };

  const handleCancel = (): void => {
    onCancel?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-md bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialReview ? 'Edit Review' : 'Create Review'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {(initialReview ? `Update your review` : `Write a new review`) + (bookingId ? ` for booking ${bookingId}` : "")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close review form"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <header className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700">Your Rating:</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </header>
          <textarea
            placeholder="Type your review..."
            className="w-full min-h-35 rounded-2xl border border-gray-300 bg-white p-4 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={reviewText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
            aria-label="Review text"
          />
        </div>

        <ActionButtons onConfirm={handleConfirm} onCancel={handleCancel} />
      </div>
    </div>
  );
}
