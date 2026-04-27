import { APIResponseMultiple, APIResponseSingle, Campground } from "./types"
import { fetchWrapper } from "./funcs" 

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function getAllCampgrounds(params?: {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  regions?: string[];
}) {
  const query = new URLSearchParams();
  if (params?.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params?.minRating && params.minRating > 0) query.set("minRating", String(params.minRating));
  if (params?.regions && params.regions.length > 0) {
    params.regions.forEach((r) => query.append("region", r));
  }

  const url = `${backendUrl}/api/v1/campgrounds${query.toString() ? "?" + query.toString() : ""}`;
  return fetchWrapper<APIResponseMultiple<Campground>>(url);
}

export async function getCampground(id: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds/${id}`
  );
}
