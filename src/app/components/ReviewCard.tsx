"use client";

import { Review } from "@/libs/types";
import { useState } from "react";
import Rating from "@mui/material/Rating";

export default function ReviewCard({
  review,
  isUserReview,
  isAdmin,
  onEdit,
  onDelete,
}: {
  review: Review;
  isUserReview: boolean;
  isAdmin: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const canManageReview = isAdmin || (isUserReview && !review.adminModified);
  //don't ask me why this is here, I think this is a edit button?

  // Template review data matching booking structure
  const templateReview = {
    _id: "booking-template-id",
    rating: 1,
    comment: "No way 67676767",
    adminModified: false,
    isHidden: false,
    campground: {
      _id: "campground-123",
      name: "Sample Campground",
    },
    user: {
      _id: "user-123",
      name: "John Doe",
    },
    createdAt: new Date().toISOString(),
  };

  // change here if you want to use template
  const displayReview = review;
  
  return (
    <div className={`border p-5 rounded-md border-gray-200 ${isUserReview ? "bg-purple-50" : ""}`}>
      <div className="flex flex-row justify-between items-center gap-3 flex-wrap" >
        <div className="flex flex-row gap-3 items-center">
          <p className="text-lg font-semibold text-gray-900">
            {displayReview.user.name} {isUserReview ? " (You)" : ""}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {(new Date(displayReview.createdAt)).toLocaleDateString()}
            {displayReview.adminModified ? " (Edited By Admin)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Rating
            name="half-rating"
            value={displayReview.rating || 0}
            precision={0.5}
            readOnly
          />
          {canManageReview && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 text-xl p-1"
                aria-label="Open review actions"
              >
                ⋯
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-32 border border-gray-200 bg-white shadow-lg z-10">
                  <button
                    onClick={() => {
                      onEdit?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {
        displayReview.comment && (
        <div
          className={`rounded-md shadow-sm p-6 mt-4 `}
        >
          <p className="text-gray-700 leading-7 ">
            {displayReview.comment}
          </p>
        </div>
      )}

    </div>
  );
}
