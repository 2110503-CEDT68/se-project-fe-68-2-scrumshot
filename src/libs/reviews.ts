import { fetchWrapper } from "./funcs";
import { APIResponseMultiple, APIResponseSingle, Review } from "./types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function getCampgroundReviews(campgroundId: string) {
  return fetchWrapper<APIResponseMultiple<Review>>(
    `${backendUrl}/api/v1/campgrounds/${campgroundId}/reviews`,
    { method: "GET" },
  );
}

type AdditionalCampground = {
  _id: string;
  name: string;
  province: string;
}

export async function getReview(id: string) {
  return fetchWrapper<APIResponseSingle<Review & { campground: AdditionalCampground }>>(
    `${backendUrl}/api/v1/reviews/${id}`,
    { method: "GET" },
  );
}

export async function updateReview(bookingId: string, rating: number, comment: string, token: string) {
  return fetchWrapper<APIResponseSingle<Review>>(
    `${backendUrl}/api/v1/bookings/${bookingId}/review`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
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
    },
  );
}
