"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ReviewExtended } from "@/libs/types";
import ReviewCard from "./ReviewCard";

interface ReviewListProps {
  reviews: ReviewExtended[];
  currentUserId?: string;
}

export default function ReviewList({
  reviews: initialReviews,
  currentUserId,
}: ReviewListProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewExtended[]>(initialReviews);

  return (
    <>
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
              isUserReview={review.user?._id === currentUserId}
              isAdmin={session?.user?.role === "admin"}
            />
          ))}
        </div>
      )}
    </>
  );
}
