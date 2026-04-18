"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Review } from '@/libs/types';
import StarRating from "./StarRating";
import ActionButtons from "./ActionButtons";
import { Button } from "@mui/material";

interface ReviewFormProps {
  disabled: boolean;
  originalRating: number | null;
  rating: number;
  onRatingChange: (rating: number) => void;
  originalComment: string | null;
  comment: string;
  onCommentChange: (comment: string) => void;
  alreadyHasReview: boolean;
  onSubmit: () => void;
  onDelete: () => void;
}

export default function ReviewForm({ disabled, rating, onRatingChange, comment, onCommentChange, alreadyHasReview, onSubmit, onDelete, originalRating, originalComment }: ReviewFormProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  
  const toggleEdit = () => {
    if (isEditing) {
      onRatingChange(originalRating ?? 0);
      onCommentChange(originalComment ?? "");
    }
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="w-full max-w-2xl rounded-md">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Review
          </h2>
        </div>
      </div>

      <div className="mb-4">
        <header className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium text-gray-700">Rating:</label>
          <StarRating rating={rating} onRatingChange={onRatingChange} disabled={!isEditing || disabled} />
        </header>
        <textarea
          placeholder="Type your review..."
          className="w-full min-h-35 rounded-2xl border border-gray-300 bg-white p-4 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={comment}
          disabled={!isEditing || disabled}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onCommentChange(e.target.value)}
          aria-label="Review text"
        />
      </div>

      {
        disabled ? null :
        (
          isEditing ? 
          <div className="flex gap-2">
            <Button variant="contained" color="secondary" onClick={toggleEdit}>Cancel</Button>
              {
                alreadyHasReview ? 
                <>
                  <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
                  <Button variant="contained" color="success" onClick={onSubmit}>Update</Button>
                </>
                :
                <Button variant="contained" color="success" onClick={onSubmit}>Create</Button>
              }
          </div>
          :
          <Button variant="contained" color="primary" onClick={toggleEdit}>Edit</Button>
        )
      }
    </div>
  );
}
