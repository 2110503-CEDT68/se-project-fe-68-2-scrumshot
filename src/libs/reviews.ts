import { fetchWrapper } from "./funcs";
import { APIResponseMultiple, APIResponseSingle, Review, ReviewExtended } from "./types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;



// --- GETTERS ---

export async function getCampgroundReviews(campgroundId: string) {
  return fetchWrapper<APIResponseMultiple<ReviewExtended>>(
    `${backendUrl}/api/v1/campgrounds/${campgroundId}/reviews`,
    { method: "GET" }
  );
}


export async function getReview(id: string) {
  return fetchWrapper<APIResponseSingle<ReviewExtended>>(
    `${backendUrl}/api/v1/reviews/${id}`,
    { method: "GET" }
  );
}

export async function getBookingReview(bookingId: string, token: string) {
  return fetchWrapper<APIResponseSingle<ReviewExtended>>(
    `${backendUrl}/api/v1/bookings/${bookingId}/review`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
}

// --- MUTATIONS ---

export async function addReview(bookingId: string, rating: number, comment: string, token: string) {
  return fetchWrapper<APIResponseSingle<ReviewExtended>>(
    `${backendUrl}/api/v1/bookings/${bookingId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  );
}

export async function updateReview(bookingId: string, rating: number, comment: string, token: string) {
  return fetchWrapper<APIResponseSingle<ReviewExtended>>(
    `${backendUrl}/api/v1/bookings/${bookingId}/review`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  );
}

export async function deleteReview(id: string, token: string) {
  return fetchWrapper<APIResponseSingle<{}>>(
    `${backendUrl}/api/v1/bookings/${id}/review`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
