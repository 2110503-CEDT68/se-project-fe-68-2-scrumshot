"use client";
import * as React from "react";
import Rating from '@mui/material/Rating';

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
}

function StarRating({ rating = 5, onRatingChange }: StarRatingProps) {
  return (
    <Rating
      name="star-rating"
      value={rating}
      precision={1}
      size="small"
      onChange={(_, value) => {
        if (value !== null) {
          onRatingChange?.(value);
        }
      }}
    />
  );
}

export default StarRating;
