import { fetchWrapper } from "./funcs"
import { APIResponseSingle } from "./types"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

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