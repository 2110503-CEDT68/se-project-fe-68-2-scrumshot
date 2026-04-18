'use client'
import { useSession, signOut } from "next-auth/react";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Booking } from "@/libs/types";
import { getAllBookings } from "@/libs/bookings";
import DeleteModal from "../components/DeleteModal";
import ReviewFormModal from "../components/ReviewFormModal";
import { deleteReview, updateReview } from "@/libs/reviews";
import StarRating from "../components/StarRating";

function AccountContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const callbackUrl = searchParams.get("callbackUrl");
  const signInUrl = callbackUrl ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/signin';
  const registerUrl = callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register';

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.backendToken) return;
      try {
        const res = await getAllBookings(session.user.backendToken);
        if (res.success) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    fetchBookings();
  }, [session?.user?.backendToken]);

  const openDeleteModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedBooking(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedBooking(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return;
    try {
      const res = await deleteReview(selectedBooking._id, session?.user?.backendToken || "");
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id && b.review
              ? { ...b, review: { ...b.review, isHidden: true } as Booking["review"] }
              : b
          )
        );
      } else {
        console.error(`Delete failed: ${res.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      closeDeleteModal();
    }
  };

  const handleEditSubmit = async (data: { rating: number; reviewText: string }) => {
    if (!selectedBooking) return;
    try {
      const res = await updateReview(
        selectedBooking._id,
        data.rating,
        data.reviewText,
        session?.user?.backendToken || "",
      );
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id && b.review
              ? { ...b, review: { ...b.review, ...res.data } as Booking["review"] }
              : b
          )
        );
        closeEditModal();
      } else {
        console.error(`Update failed: ${res.message}`);
        alert(`Update failed: ${res.message}`);
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // Show bookings that have a review object (even if rating is hidden/stripped by API for non-admins)
  const bookingsWithReviews = bookings.filter((b) => b.review && (b.review.rating || b.review.isHidden));

  return (
    <main className="w-full m-2 flex justify-center">
      <div className="bg-neutral-50 w-full flex flex-col gap-8 max-w-3xl mt-5 p-5 rounded-md shadow-md">
        <div className="flex flex-col">
          {session?.user?.role === "admin" ? (
            <h3 className="text-xl font-semibold text-red-900">
              {session?.user?.name} [Administrator]
            </h3>
          ) : (
            <h3 className="text-xl font-semibold">
              {session?.user?.name || 'Guest'}
            </h3>
          )}

          <p className="text-xs text-gray-400">{session?.user?.email || 'Please login to use the website'}</p>
        </div>
        <div className="flex flex-col gap-2 text-gray-600">
          <div className="flex justify-between items-center">
            <p>Name</p>
            <p>{session?.user?.name || '-'}</p>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p>Email</p>
            <p>{session?.user?.email || '-'}</p>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p>Phone Number</p>
            <p>{session?.user?.tel || '-'}</p>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p>Id</p>
            <p>{session?.user?._id || '-'}</p>
          </div>
        </div>

        {/* Reviews Section */}
        {session?.user && bookingsWithReviews.length > 0 && (
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold">My Reviews</h4>
            <div className="flex flex-col gap-4">
              {bookingsWithReviews.map((booking) => {
              const review = booking.review!;
              return (
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">{booking.campground.name}</p>

                      {review.rating ? (
                        <StarRating rating={review.rating} size="small" />
                      ) : (
                        <p className="text-xs text-gray-400 italic">Rating hidden</p>
                      )}

                      {review.comment && (
                        <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                      )}
                      {review.isHidden && (
                        <p className="text-xs text-red-500 mt-1 italic">
                          This review was hidden by an admin
                        </p>
                      )}
                      {review.isLocked && (
                        <p className="text-xs text-orange-500 mt-1 italic">
                          This review is locked and cannot be edited
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!review.isLocked && !review.isHidden && review.rating && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => openEditModal(booking)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => openDeleteModal(booking)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        )}

        <div>
          {
            session?.user ?
              <Button variant="contained" color="error" size="small" onClick={() => signOut({ callbackUrl: '/' })} sx={{ borderRadius: '24px' }}>
                <p className="font-bold mt-1">
                  Sign out
                </p>
              </Button>
            :
            <div className="flex gap-5 items-center">
              <Button variant="contained" color="success" size="small" onClick={() => router.push(signInUrl)} sx={{ borderRadius: '24px' }}>
                <p className="font-bold mt-1">
                  Sign in
                </p>
              </Button>
              <Button variant="contained" color="primary" size="small" onClick={() => router.push(registerUrl)} sx={{ borderRadius: '24px' }}>
                <p className="font-bold mt-1">
                  Register
                </p>
              </Button>
            </div>
          }
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isFinalDeletion={selectedBooking?.review?.adminModified}
      />

      <ReviewFormModal
        isOpen={isEditModalOpen}
        initialReview={selectedBooking?.review ?? null}
        onSubmit={handleEditSubmit}
        onCancel={closeEditModal}
        bookingId={selectedBooking?._id}
      />
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="w-full text-center mt-10">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
