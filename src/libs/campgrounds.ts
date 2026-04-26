import { APIResponseMultiple, APIResponseSingle, Campground, CampgroundModifiable } from "./types"
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

export async function createCampground(campground: CampgroundModifiable, token: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds`,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(campground),
    }
  );
}

export async function updateCampground(id: string, campground: CampgroundModifiable, token: string) {
  return fetchWrapper<APIResponseSingle<Campground>>(
    `${backendUrl}/api/v1/campgrounds/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(campground),
    }
  );
}


export function validateCampground(campground: CampgroundModifiable): [keyof CampgroundModifiable, string] | [null, null] {
  // returns the first invalid field and an error message, or [true, null] if valid
  if (!campground.picture.trim()) return ['picture', 'Campground Picture Link is required'];
  if (!campground.name.trim()) return ['name', 'Campground Name is required'];
  if (!campground.description.trim()) return ['description', 'Description is required'];
  if (!campground.address.trim()) return ['address', 'Address is required'];
  if (!campground.province.trim()) return ['province', 'Province is required'];
  if (!campground.district.trim()) return ['district', 'District is required'];
  if (!campground.region) return ['region', 'Region is required'];
  if (!campground.postalcode.trim()) return ['postalcode', 'Postal Code is required'];
  if (campground.postalcode.length > 5) return ['postalcode', 'Postal Code cannot exceed 5 digits'];
  if (!campground.tel.trim()) return ['tel', 'Telephone Number is required'];
  if (campground.tel.length > 15) return ['tel', 'Telephone Number must be 15 characters or less'];
  if (!campground.pricePerNight) return ['pricePerNight', 'Price Per Night is required'];
  if (isNaN(Number(campground.pricePerNight)) || Number(campground.pricePerNight) <= 0) return ['pricePerNight', 'Price Per Night must be valid']; 
  return [null, null];
};