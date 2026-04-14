"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import ActionButtons from "./ActionButtons";

interface ReviewData {
  rating: number;
  reviewText: string;
}

interface ReviewFormProps {
  onSubmit?: (data: ReviewData) => void;
  onCancel?: () => void;
}

function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularise...");

  const handleConfirm = (): void => {
    if (onSubmit) {
      onSubmit({ rating, reviewText });
    }
  };

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <section className="w-full max-w-[678px] bg-white p-6 font-sans mx-auto">
        <div className="mb-4">
          <header className="flex items-center gap-1 mb-4">
            <label className="text-sm font-normal text-gray-500">Your Rating :</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </header>
          <div className="relative">
            <textarea
              placeholder="type in review e.g. What is Lorem Ipsum?"
              className="w-full h-[140px] rounded-lg text-sm font-normal text-gray-500 leading-5 resize-none p-3 border border-gray-300 font-sans box-border focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] placeholder:text-gray-400"
              value={reviewText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
              aria-label="Review text"
            />
          </div>
        </div>
        <ActionButtons onConfirm={handleConfirm} onCancel={handleCancel} />
      </section>
    </>
  );
}

export default ReviewForm;
