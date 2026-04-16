import { fetchWrapper } from "./funcs"
import { APIResponseSingle, Review } from "./types"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function getReview(bookingId: string) {
  return fetchWrapper<APIResponseSingle<Review & { campground: { name: string; province: string }; user: { name: string } }>>(
    `${backendUrl}/api/v1/bookings/${bookingId}/review`,
    { method: "GET" }
  )
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
  )
}

export async function deleteReview(id: string, token: string) {
  return fetchWrapper<APIResponseSingle<{}>>(
    `${backendUrl}/api/v1/bookings/${id}/review`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}