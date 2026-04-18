"use client";
import * as React from "react";

interface ActionButtonsProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

function ActionButtons({ onConfirm, onCancel }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-all duration-150 ease-in-out py-3 px-8"
        onClick={onConfirm}
      >
        Confirm
      </button>
      <button
        className="bg-white hover:bg-red-50 text-red-600 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-150 ease-in-out py-3 px-8 border border-red-600"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

export default ActionButtons;
