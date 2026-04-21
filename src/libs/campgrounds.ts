import { APIResponseMultiple, APIResponseSingle, Campground, APIResponseMessage } from "./types"
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

export async function deleteCampground(id: string, token: string) {
  return fetchWrapper<APIResponseMessage>(
    `${backendUrl}/api/v1/campgrounds/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
}
