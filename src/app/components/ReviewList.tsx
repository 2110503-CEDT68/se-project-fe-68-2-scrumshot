"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Booking, Review } from "@/libs/types";
import ReviewCard from "./ReviewCard";
import ReviewFormModal from "./ReviewFormModal";
import { addReview, updateReview } from "@/libs/reviews";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  canCreateReview?: boolean;
  bookings: Booking[];
}

export default function ReviewList({
  reviews: initialReviews,
  currentUserId,
  canCreateReview,
  bookings,
}: ReviewListProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const userHasReview = reviews.some(
    (review) => review.user._id === currentUserId,
  );

  const openReviewModal = (review?: Review | null) => {
    setSelectedReview(review ?? null);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleSubmitReview = async (data: {
    rating: number;
    reviewText: string;
  }) => {
    const isEditing = !!selectedReview;
    const targetBookingId = isEditing ? selectedReview?._id : bookings[0]?._id;

    if (!targetBookingId) {
      console.error(
        "Missing bookingId. Review cannot be created or edited without a booking.",
      );
      return;
    }

    try {
      let response;
      if (isEditing) 
        response = await updateReview(targetBookingId, data.rating, data.reviewText, session?.user?.backendToken || '')
      else
        response = await addReview(targetBookingId, data.rating, data.reviewText, session?.user?.backendToken || '')
      
      if (!response.success) {
        console.error(`Review ${isEditing ? "update" : "creation"} failed: ${response.message}`,);
        return; // TODO: notify the user too ok?
      }
      
      console.log(response.data)

      if (isEditing) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === selectedReview._id ? { ...response.data }
            : r,
          ),
        );
      } else {
        setReviews((prev) => [response.data, ...prev]);
      }

      closeReviewModal();
    } catch (error) {
      console.error("Review submit error:", error);
    }
  };

  return (
    <>
      {!userHasReview && canCreateReview && (
        <div className="flex gap-3">
          <button
            onClick={() => openReviewModal(null)}
            className="rounded-xl px-4 py-2 text-left text-sm border border-[#6750A4] text-[#6750A4] hover:bg-[#6750A4] hover:text-white transition-colors duration-200"
          >
            Create New Review
          </button>
        </div>
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
              isAdmin={session?.user?.role === "admin"}
              onEdit={() => openReviewModal(review)}
              onDelete={() => console.log("Delete review clicked", review._id)}
            />
          ))}
        </div>
      )}

      <ReviewFormModal
        isOpen={isModalOpen}
        initialReview={selectedReview}
        onSubmit={handleSubmitReview}
        onCancel={closeReviewModal}
        bookingId={selectedReview?._id || bookings[0]?._id}
      />
    </>
  );
}
