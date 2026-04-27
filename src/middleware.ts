import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isProtected = req.nextUrl.pathname.startsWith("/bookings") || req.nextUrl.pathname.includes("/booking");
  const adminProtected = req.nextUrl.pathname.startsWith("/campgrounds") &&
    (req.nextUrl.pathname.includes("/edit") || req.nextUrl.pathname.includes("/create"));

  if ((!token && isProtected) || (token?.role !== "admin" && adminProtected)) {
    const url = req.nextUrl.clone();
    url.pathname = "/account";
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/bookings/:path*",
    "/campgrounds/:path*/booking/:path*",
    "/campgrounds/create",
    "/campgrounds/:path*/edit",
  ],
};
