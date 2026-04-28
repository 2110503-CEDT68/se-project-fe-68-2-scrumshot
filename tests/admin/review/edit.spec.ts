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

test.describe("Admin edit review", () => {
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
          comment: "PLAYWRIGHT ADMIN EDIT TEST " + Date.now(),
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

  // AC1: Admin edits any review → review is updated, campground stats are updated
  test("admin should be able to edit any review and campground stats are updated", async ({
    page,
    request,
    backendLink,
  }) => {
    if (!currentBooking || !currentCampground) throw new Error("Setup failed");

    // Record campground stats before the admin edit
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

    // Enter edit mode
    await page.getByTestId("edit-review").click();

    const commentInput = page.getByTestId("comment-input");
    await expect(commentInput).toBeEnabled();

    // Change the comment
    const NEW_COMMENT = "ADMIN EDITED REVIEW " + Date.now();
    await commentInput.fill(NEW_COMMENT);

    // Change rating to 5 stars
    const NEW_RATING = 5;
    const ratingMUI = page.getByTestId("star-rating");
    const ratingInput = ratingMUI.locator(
      `input[type='radio'][value='${NEW_RATING}']`
    );
    const ratingLabel = ratingMUI.locator(
      `label[for='${await ratingInput.getAttribute("id")}']`
    );
    await expect(ratingLabel).toBeVisible();
    await ratingLabel.click({ delay: 100 });

    // Submit and wait for the backend to respond
    await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes(`/bookings/${currentBooking!._id}/review`)
      ),
      page.getByTestId("update-review").click(),
    ]);

    // Verify updated comment is displayed on the booking page
    await expect(commentInput).toHaveValue(NEW_COMMENT);
    await expect(commentInput).toBeDisabled();

    // Admin-modified notice should appear on the booking page
    await expect(
      page.getByText("This review has been modified by an admin.")
    ).toBeVisible();

    // Navigate to the campground page and verify the updated review card appears
    await page.goto(`/campgrounds/${currentCampground._id}`);
    const reviewCard = page
      .getByTestId("review-card")
      .filter({ has: page.getByText(NEW_COMMENT) });
    await expect(reviewCard.first()).toBeVisible();

    // Verify totalReviews is unchanged (edit ≠ new review)
    const campAfterRes = await request.get(
      `${backendLink}/campgrounds/${currentCampground._id}`
    );
    const campAfter: APIResponseSingle<Campground> = await campAfterRes.json();
    expect(campAfter.data.totalReviews).toBe(totalReviewsBefore);
  });

  // AC2: After admin edits a user review, the user is blocked from editing it
  test("user should be blocked from editing a review that admin has modified", async ({
    page,
    browser,
  }) => {
    if (!currentBooking) throw new Error("Setup failed");

    // Admin edits the review
    await page.goto(`/bookings/${currentBooking._id}`);
    await page.waitForLoadState("networkidle");

    const reviewHeading = page.getByRole("heading", { name: "Review" });
    await expect(reviewHeading).toBeVisible();
    await reviewHeading.scrollIntoViewIfNeeded();

    await page.getByTestId("edit-review").click();

    const ADMIN_COMMENT = "ADMIN LOCKED REVIEW " + Date.now();
    const commentInput = page.getByTestId("comment-input");
    await expect(commentInput).toBeEnabled();
    await commentInput.fill(ADMIN_COMMENT);

    await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes(`/bookings/${currentBooking!._id}/review`)
      ),
      page.getByTestId("update-review").click(),
    ]);

    await expect(page.getByText(ADMIN_COMMENT)).toBeVisible();

    // User now tries to access the same booking
    const userContext = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const userPage = await userContext.newPage();

    await userPage.goto(`/bookings/${currentBooking._id}`);
    await userPage.waitForLoadState("networkidle");

    // The admin-modified notice should be visible to the user
    await expect(
      userPage.getByText("This review has been modified by an admin.")
    ).toBeVisible();

    // The Edit button must not be accessible — user is blocked from editing
    await expect(userPage.getByTestId("edit-review")).not.toBeVisible();

    // The comment textarea must be disabled
    await expect(userPage.getByTestId("comment-input")).toBeDisabled();

    await userContext.close();
  });
});
