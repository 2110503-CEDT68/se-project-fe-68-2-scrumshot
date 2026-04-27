"use client";
import Image from "next/image";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import { Campground } from "@/libs/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { deleteCampground } from "@/libs/campgrounds";
import DeleteCampgroundModal from "./DeleteCampgroundModal";

export default function CampgroundCard({
  campground,
  handleDelete,
}: {
  campground: Campground;
  handleDelete: (_id: string) => void;
}) {
  
  const {
    _id,
    name,
    address,
    description,
    pricePerNight,
    picture,
    avgRating,
    totalReviews,
  } = campground;
  
  const router = useRouter();
  
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="flex flex-col md:flex-row bg-white rounded-[20px] shadow-lg border border-blue-200 overflow-hidden mb-6 p-6 gap-6"
    >
      <div className="relative w-full md:w-1/2 h-64 flex-shrink-0">
        <Image
          src={picture || "/img/banner.jpg"}
          alt={name || "Campground Image"}
          fill
          className="object-cover rounded-[15px]"
          unoptimized
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">{name}</h2>
          <p className="text-xs text-gray-500 text-center mb-4">{address}</p>
          <p className="text-sm text-gray-700 text-left leading-relaxed mb-4">
            {description}
          </p>

          <div className="flex items-center justify-start gap-2 mb-4">
            <Rating
              name="half-rating"
              value={avgRating || 0}
              precision={0.5}
              readOnly
            />
            <span className="font-bold text-gray-800">
              {avgRating ? avgRating.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm text-gray-500 font-medium ml-1">
              ({totalReviews || 0} reviews)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Link
            href={`/campgrounds/${_id}`}
            className="w-full sm:w-auto bg-[#6750A4] hover:bg-[#524082]
              text-white text-sm py-2 px-4 rounded-lg flex items-center justify-center
              shadow-md transition-colors text-nowrap
            "
          >
            Book for {pricePerNight} Baht / Night
            <span className="ml-2">✏️</span>
          </Link>

          {session?.user.role === "admin" && (
            <>
              <Link
                href={`/campgrounds/${_id}/edit`}
                className="bg-transparent border border-[#FEA809]
                  text-[#FEA809] text-sm py-2 px-4 rounded-lg flex items-center justify-center
                  shadow-sm transition-colors hover:bg-[#FEA809] hover:text-white "
              >
                Edit
              </Link>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-transparent border border-red-500 cursor-pointer
                  text-red-500 text-sm py-2 px-4 rounded-lg flex items-center justify-center
                  shadow-sm transition-colors hover:bg-red-500 hover:text-white "
              >
                Delete
              </button>
              
              <DeleteCampgroundModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => {handleDelete(_id); setIsModalOpen(false)}} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
