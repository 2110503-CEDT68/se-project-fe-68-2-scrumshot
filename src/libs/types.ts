export type Role = "user" | "admin";

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
  province: string;
  postalcode: string;
  tel: string;
  region: string;
  pricePerNight: number;
  picture: string;
  createdAt: string;
  avgRating: number;
  totalReviews: number;
}

export interface CampgroundQueryParams {
  name?: string; // ค้นหาชื่อ campground
  region?: string; // ภูมิภาค เช่น north, south
  minPrice?: number; // ราคาขั้นต่ำ
  maxPrice?: number; // ราคาสูงสุด
  minRating?: number; // rating ขั้นต่ำ
  sortBy?: "name" | "pricePerNight" | "avgRating" | "createdAt"; // เรียงตามอะไร
  sortOrder?: "asc" | "desc"; // เรียงน้อย→มาก หรือ มาก→น้อย
  limit?: number; // จำนวนต่อหน้า
  page?: number; // หน้าที่ต้องการ
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
