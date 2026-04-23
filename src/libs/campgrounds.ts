import { APIResponseMultiple, APIResponseSingle, Campground } from "./types"
import { fetchWrapper } from "./funcs" 


const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function getAllCampgrounds() {
  return fetchWrapper<APIResponseMultiple<Campground>>(
    `${backendUrl}/api/v1/campgrounds`
  );
}

export async function getCampground(id: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds/${id}`
  );
}

export async function createCampground(campgroundData: Partial<Campground>, token?: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(campgroundData),
    }
  );
}
