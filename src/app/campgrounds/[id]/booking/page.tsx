"use client";

import { useState, useEffect, use } from "react";
import { Dayjs } from "dayjs";
import DateReserve from "@/app/components/DateReserve";
import { getCampground } from "@/libs/campgrounds";
import { createBooking } from "@/libs/bookings";
import { Campground } from "@/libs/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReviewForm from "@/app/components/ReviewForm";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [campground, setCampground] = useState<Campground | null>(null);
  const [bookDate, setBookDate] = useState<Dayjs | null>(null);
  const [bookEndDate, setBookEndDate] = useState<Dayjs | null>(null);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCampground(id);
      if (response.success) setCampground(response.data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (bookDate && bookEndDate && campground) {
      const nights = bookEndDate.diff(bookDate, "day");
      if (nights > 0) {
        setTotalPrice(nights * campground.pricePerNight);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [bookDate, bookEndDate, campground]);

  const handleConfirm = async () => {
    if (!bookDate || !bookEndDate || totalPrice <= 0) {
      alert("Please select valid Start and End dates (at least 1 night)");
      return;
    }

    if (!session || !session.user.backendToken) {
      alert("Please sign in to make a booking");
      return;
    }

    try {
      const response = await createBooking(
        id,
        session.user.backendToken,
        bookDate.format("YYYY-MM-DD"),
        bookEndDate.format("YYYY-MM-DD"),
      );

      if (response.success) {
        alert("Booking Successful!");
        router.push("/bookings");
        router.refresh();
      } else {
        alert(`Booking Failed: ${response.message}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred. Please try again.");
    }
  };


  if (!campground) return <div className="text-center pt-20">Loading...</div>;

  return (
    <main className="w-full flex-col items-center pt-20 font-sans text-black">
      <div className="w-[750px] bg-white p-10 rounded-sm shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-12">
          Booking For: {campground.name}
        </h1>

        <div className="flex gap-4 mb-12 text-black">
          <div className="flex-1">
            <span className="block mb-2 font-semibold">Start Date</span>
            <DateReserve
              onDateChange={(value: Dayjs | null) => setBookDate(value)}
              value={bookDate}
            />
          </div>
          <div className="flex-1">
            <span className="block mb-2 font-semibold">End Date</span>
            <DateReserve
              onDateChange={(value: Dayjs | null) => setBookEndDate(value)}
              value={bookEndDate}
            />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-green-900 text-2xl font-bold">
            Total Price: {totalPrice.toLocaleString()} THB
            {totalPrice > 0 && (
              <span className="text-sm font-normal text-gray-500 block">
                ({bookEndDate?.diff(bookDate, "day")} Nights @{" "}
                {campground.pricePerNight}/night)
              </span>
            )}
          </div>

          <div className="flex gap-8 mb-1">
            <button
              onClick={() => router.back()}
              className="text-gray-500 font-semibold text-lg hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={totalPrice <= 0}
              className={`px-8 py-3 rounded-md font-semibold text-lg transition-colors ${
                totalPrice > 0
                  ? "bg-[#6750A4] text-white hover:bg-[#524082]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
