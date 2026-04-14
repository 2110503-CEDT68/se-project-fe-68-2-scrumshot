"use client";
import * as React from "react";

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
}

function StarRating({ rating = 5, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1 ml-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`ti ti-star-filled text-xl cursor-pointer transition-all duration-150 ease-in-out hover:scale-110 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
}

export default StarRating;
