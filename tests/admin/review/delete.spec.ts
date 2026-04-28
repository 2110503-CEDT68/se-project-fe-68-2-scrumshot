import { expect } from "@playwright/test";
import { test } from "../../fixtures";
import { decode } from "next-auth/jwt";
import {
  APIResponseMultiple,
  APIResponseSingle,
  Booking,
  Campground,
} from "@/libs/types";

let currentCampground: Campground | null = null;
let currentBooking: Booking | null = null;
let userBackendToken: string = "";

const INITIAL_RATING = 3;

test.describe("Admin delete review", () => {
  test.beforeEach(async ({ browser, request, backendLink }) => {
    currentCampground = null;
    currentBooking = null;

    // Decode user session to obtain their backend token for API setup
    const userContext = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const userState = await userContext.storageState();
    const userSessionCookie = userState.cookies.find(
      (c) => c.name === "next-auth.session-token"
    );
    if (!userSessionCookie) throw new Error("No user session cookie found");

    const decoded = await decode({
      token: userSessionCookie.value,
      secret: process.env.NEXTAUTH_SECRET!,
    });
    if (!decoded || !decoded.backendToken)
      throw new Error("Failed to decode user session");
    userBackendToken = decoded.backendToken as string;
    await userContext.close();

    // Find a campground to use
    const campRes = await request.get(`${backendLink}/campgrounds`);
    const campData: APIResponseMultiple<Campground> = await campRes.json();
    if (!campData.data.length) throw new Error("No campground found");
    currentCampground = campData.data[0];

    // Create a booking as the user
    const bookingRes = await request.post(
      `${backendLink}/campgrounds/${currentCampground._id}/bookings`,
      {
        headers: {
          Authorization: `Bearer ${userBackendToken}`,
          "Content-Type": "application/json",
        },
        data: {
          bookDate: "2024-01-01",
          bookEndDate: "2024-01-02",
        },
      }
    );
    const bookingJson = await bookingRes.json();
    if (!bookingJson.data) throw new Error("Failed to create booking");
    currentBooking = bookingJson.data;

    // Create a review as the user for that booking
    const reviewRes = await request.post(
      `${backendLink}/bookings/${currentBooking?._id}/review`,
      {
        headers: {
          Authorization: `Bearer ${userBackendToken}`,
          "Content-Type": "application/json",
        },
        data: {
          rating: INITIAL_RATING,
          comment: "PLAYWRIGHT ADMIN DELETE TEST " + Date.now(),
        },
      }
    );
    if (!reviewRes.ok) throw new Error("Failed to create review");
  });

  test.afterEach(async ({ request, backendLink, session }) => {
    if (currentBooking) {
      await request.delete(`${backendLink}/bookings/${currentBooking._id}`, {
        headers: {
          Authorization: `Bearer ${session.backendToken}`,
        },
      });
    }
  });

  // AC1: Admin deletes any review → review is removed, campground stats are updated
  test("admin should be able to delete any review and campground stats are updated", async ({
    page,
    request,
    backendLink,
  }) => {
    if (!currentBooking || !currentCampground) throw new Error("Setup failed");

    // Record campground stats before the admin delete
    const campBeforeRes = await request.get(
      `${backendLink}/campgrounds/${currentCampground._id}`
    );
    const campBefore: APIResponseSingle<Campground> =
      await campBeforeRes.json();
    const totalReviewsBefore = campBefore.data.totalReviews;

    // Navigate to the booking page as admin
    await page.goto(`/bookings/${currentBooking._id}`);
    await page.waitForLoadState("networkidle");

    const reviewHeading = page.getByRole("heading", { name: "Review" });
    await expect(reviewHeading).toBeVisible();
    await reviewHeading.scrollIntoViewIfNeeded();

    // Enter edit mode to access delete
    const editBtn = page.getByTestId("edit-review");
    await editBtn.waitFor({ state: "visible" });
    await editBtn.click();
    
    // Click delete button and wait for modal to appear
    await page.getByTestId("delete-review").click();

    const modal = page.locator("div.fixed");
    await expect(modal).toBeVisible();
    await expect(
      page.getByText("Are you sure you want to delete this review?")
    ).toBeVisible();

    // Confirm deletion — wait for response
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes(`/bookings/${currentBooking!._id}/review`) &&
          res.status() === 200,
      ),
      modal.getByRole("button", { name: "Delete", exact: true }).click(),
    ]);

    // Wait for review content to be removed from the page
    await expect(
      page.getByText(`PLAYWRIGHT ADMIN DELETE TEST`)
    ).not.toBeVisible();

    // Navigate to campground page and verify review is removed
    await page.goto(`/campgrounds/${currentCampground._id}`);
    await page.waitForLoadState("networkidle");

    const campAfterRes = await request.get(
      `${backendLink}/campgrounds/${currentCampground._id}`
    );
    const campAfter: APIResponseSingle<Campground> = await campAfterRes.json();
    const totalReviewsAfter = campAfter.data.totalReviews;

    // Stats should be decremented
    expect(totalReviewsAfter).toBeLessThan(totalReviewsBefore);
  });
});