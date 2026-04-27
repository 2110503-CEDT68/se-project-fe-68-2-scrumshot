import {
  APIResponseMultiple,
  APIResponseSingle,
  Campground,
  CampgroundQueryParams,
} from "./types";
import { fetchWrapper } from "./funcs";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

function appendQueryParam(
  url: URL,
  key: keyof CampgroundQueryParams,
  value: unknown,
) {
  if (value === undefined || value === null || value === "") return;

  if (Array.isArray(value)) {
    value.forEach((v) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.append(String(key), String(v));
      }
    });
  } else {
    url.searchParams.append(String(key), String(value));
  }
}

export async function getAllCampgrounds(queryParams?: CampgroundQueryParams) {
  const url = new URL(`${backendUrl}/api/v1/campgrounds`);

  if (queryParams) {
    (Object.keys(queryParams) as (keyof CampgroundQueryParams)[]).forEach(
      (key) => appendQueryParam(url, key, queryParams[key])
    );
  }

  return fetchWrapper<APIResponseMultiple<Campground>>(url.toString());
}

export async function getCampground(id: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds/${id}`,
  );
}
