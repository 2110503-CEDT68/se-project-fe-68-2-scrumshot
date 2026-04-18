'use client';

import { useState } from 'react';
import { Review } from '@/libs/types';
import ReviewCard from './ReviewCard';
import ReviewFormModal from './ReviewFormModal';

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
}

export default function ReviewList({ reviews, currentUserId }: ReviewListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const userHasReview = reviews.some((review) => review.user._id === currentUserId);

  const openReviewModal = (review?: Review | null) => {
    setSelectedReview(review ?? null);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleSubmitReview = (data: { rating: number; reviewText: string }) => {
    console.log('Submit review data:', data, selectedReview ? 'editing' : 'creating');
    closeReviewModal();
  };

  return (
    <>
      {!userHasReview && (
        <button
          onClick={() => openReviewModal(null)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          Create New Review
        </button>
      )}

      {reviews.length === 0 ? (
        <div className="space-y-6">
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            There's no review yet. Be the first one to review this campground!
            <div className="mt-4 py-4 w-full border-b-2 border-gray-100"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              isUserReview={review.user._id === currentUserId}
              onEdit={() => openReviewModal(review)}
              onDelete={() => console.log('Delete review clicked', review._id)}
            />
          ))}
        </div>
      )}

      <ReviewFormModal
        isOpen={isModalOpen}
        initialReview={selectedReview}
        onSubmit={handleSubmitReview}
        onCancel={closeReviewModal}
      />
    </>
  );
}
