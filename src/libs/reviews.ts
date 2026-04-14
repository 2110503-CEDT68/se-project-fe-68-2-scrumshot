import { fetchWrapper } from "./funcs"
import { APIResponseSingle, Review } from "./types"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function postReview(bookingId: string, rating: number, comment: string, token: string) {
  return fetchWrapper<APIResponseSingle<Review>>(
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