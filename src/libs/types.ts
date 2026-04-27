export type Role = "user" | "admin";

export const REGIONS = ["Northern", "Northeastern", "Western", "Central", "Eastern", "South"] as const;
export type Region = typeof REGIONS[number];

export interface Booking {
  _id: string;
  bookDate: string;
  bookEndDate: string;
  user: string;
  campground: Campground;
  totalPrice: number;
  createdAt: string;
  review?: Review;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: Role;
  // password: string;
  createdAt: string;
}

export interface CampgroundModifiable {
  name: string;
  description: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  region: Region;
  pricePerNight: number;
  picture: string;
}

export interface Campground extends CampgroundModifiable {
  _id: string;
  createdAt: string;
  avgRating: number;
  totalReviews: number;
}

export interface CampgroundQueryParams {
  name?: string; 
  region?: Region[]; 
  minPrice?: number; 
  maxPrice?: number; 
  minRating?: number;
  maxRating?: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  adminModified: boolean;
  isHidden: boolean;
  createdAt: string;
}

export interface ReviewExtended extends Review {
  user: {
    // Only comes with this much apparently
    _id: string;
    name: string;
  };
  campground: {
    _id: string;
    name: string;
  };
}

export interface APIResponseSingle<T> {
  success: true;
  data: T;
}

export interface APIResponseMultiple<T> {
  success: true;
  count: number;
  data: T[];
}

export interface APIResponseMessage {
  success: true;
  message: string;
}

export interface APIResponseToken {
  success: true;
  token: string;
  data: User;
}

export interface APIResponseError {
  success: false;
  message: string;
}
