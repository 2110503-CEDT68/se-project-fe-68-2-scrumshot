'use client';

import { Review } from '@/libs/types';
import { useState } from 'react';
import Rating from '@mui/material/Rating';

export default function ReviewCard({ review, isUserReview, onEdit, onDelete }: { review: Review; isUserReview: boolean; onEdit?: () => void; onDelete?: () => void }) {
  const [showMenu, setShowMenu] = useState(false);
  //don't ask me why this is here, I think this is a edit button?

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-5">
        <div>
          <p className="text-lg font-semibold text-gray-900">{review.user.name}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDate(review.createdAt)}{review.adminModified ? ' (Edited)' : ''}</p>
        </div>

        <div className="flex items-center gap-2">
          <Rating name="half-rating" defaultValue={review.rating || 0} precision={0.5} readOnly />
          {isUserReview && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 text-xl p-1"
                aria-label="Open review actions"
              >
                ⋯
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-2xl border border-gray-200 bg-white shadow-lg z-10">
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

      <div className={`rounded-b-[28px] border-t border-gray-200 p-6 ${isUserReview ? 'bg-purple-50' : 'bg-gray-50'}`}>
        <p className="text-gray-700 leading-7">{review.comment || 'No review comment available.'}</p>
      </div>
    </div>
  );
}
