'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Review } from '@/libs/types';
import ReviewCard from './ReviewCard';
import ReviewFormModal from './ReviewFormModal';

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  canCreateReview?: boolean;
  bookingId?: string | null;
}

export default function ReviewList({ reviews: initialReviews, currentUserId, canCreateReview, bookingId }: ReviewListProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
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

  const handleSubmitReview = async (data: { rating: number; reviewText: string }) => {
    if (!bookingId) {
      console.error('Missing bookingId. Review cannot be created or edited without a booking.');
      return;
    }

    const isEditing = !!selectedReview;

    try {
      const response = await fetch('/api/reviews', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, rating: data.rating, comment: data.reviewText }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error(`Review ${isEditing ? 'update' : 'creation'} failed:`, result);
        return;
      }

      if (isEditing) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === selectedReview._id
              ? { ...r, rating: data.rating, comment: data.reviewText, adminModified: true }
              : r
          )
        );
      } else if (result.data && session?.user) {
        const optimisticReview: Review = {
          ...result.data,
          createdAt: new Date().toISOString(),
          user: {
            _id: (session.user as any)._id || currentUserId || '',
            name: session.user.name || 'Anonymous',
          },
        };
        setReviews((prev) => [optimisticReview, ...prev]);
      }

      closeReviewModal();
    } catch (error) {
      console.error('Review submit error:', error);
    }
  };

  return (
    <>
      {!userHasReview && canCreateReview && (
        <button
          onClick={() => openReviewModal(null)}
          className="rounded-xl px-4 py-2 text-left text-sm border border-[#6750A4] text-[#6750A4] hover:bg-[#6750A4] hover:text-white transition-colors duration-200"
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
