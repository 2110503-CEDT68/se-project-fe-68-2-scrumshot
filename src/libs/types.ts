export type Role = 'user' | 'admin';

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

export interface Campground {
  _id: string;
  name: string;
  description: string;
  address: string;
  district: string;
  province: string
  postalcode: string;
  tel: string;
  region: string;
  pricePerNight: number;
  picture: string;
  createdAt: string;
  avgRating: number;
  totalReviews: number;
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  adminModified: boolean; 
  user: { // Only comes with this much apparently
    _id: string;
    name: string;
  }
  createdAt: string;
  campground: {
    _id: string;
    name: string;
  }
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
