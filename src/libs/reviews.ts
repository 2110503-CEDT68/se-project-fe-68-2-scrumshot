import { fetchWrapper } from "./funcs";
import { APIResponseMultiple, APIResponseSingle, Review } from "./types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function getCampgroundReviews(campgroundId: string) {
  return fetchWrapper<APIResponseMultiple<Review>>(
    `${backendUrl}/api/v1/campgrounds/${campgroundId}/reviews`,
    { method: "GET", },
  );
}

interface AdditionalCampground {
  _id: string;
  name: string;
  province: string;
}

export async function getReview(id: string) {
  return fetchWrapper<APIResponseSingle<Review & AdditionalCampground>>(
    `${backendUrl}/api/v1/reviews/${id}`,
    { method: "GET", },
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
