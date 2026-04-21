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

function normalizeQueryParams(
  params?: CampgroundQueryParams,
): CampgroundQueryParams {
  return {
    ...params,
    page: params?.page && params.page > 0 ? params.page : 1,
    limit: params?.limit && params.limit > 0 ? params.limit : 10,
  };
}

export async function getAllCampgrounds(queryParams?: CampgroundQueryParams) {
  const url = new URL(`${backendUrl}/api/v1/campgrounds`);

  const normalizedParams = normalizeQueryParams(queryParams);

  if (normalizedParams) {
    (Object.keys(normalizedParams) as (keyof CampgroundQueryParams)[]).forEach(
      (key) => {
        appendQueryParam(url, key, normalizedParams[key]);
      },
    );
  }

  return fetchWrapper<APIResponseMultiple<Campground>>(url.toString());
}

export async function getCampground(id: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds/${id}`,
  );
}
