import { fetchWrapper } from "./funcs"
import { APIResponseMultiple, APIResponseSingle, Booking } from "./types"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function getAllBookings(token: string) {
  return fetchWrapper<APIResponseMultiple<Booking>>(
    `${backendUrl}/api/v1/bookings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export async function getBooking(id: string, token: string) {
  return fetchWrapper<APIResponseSingle<Booking>>(
    `${backendUrl}/api/v1/bookings/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export async function createBooking(campgroundId: string, token: string, bookDate: string, bookEndDate: string) {
  const booking = { bookDate, bookEndDate };
  return fetchWrapper<APIResponseSingle<Booking>>(
    `${backendUrl}/api/v1/campgrounds/${campgroundId}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(booking),
    }
  )
}

export async function updateBooking(id: string, token: string, bookingBody: Object) {
  return fetchWrapper<APIResponseSingle<Booking>>(
    `${backendUrl}/api/v1/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bookingBody),
    }
  )
}

export async function deleteBooking(id: string, token: string) {
  return fetchWrapper<APIResponseSingle<{}>>(
    `${backendUrl}/api/v1/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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