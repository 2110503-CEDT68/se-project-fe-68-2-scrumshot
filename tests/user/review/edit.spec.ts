import { expect } from "@playwright/test";
import { test } from "../../fixtures";
import {
  APIResponseMultiple,
  Campground,
  Booking,
} from "@/libs/types";

let currentCampground: Campground | null = null;
let currentBooking: Booking | null = null;
let reviewComment: string = "";

test.describe("Review editing", () => {
  test.beforeEach(async ({ page, request, backendLink, session }) => {
    const { backendToken } = session;

    currentCampground = null;
    currentBooking = null;

    // Step 1: Retrieve campground list
    const campgroundRes = await request.get(`${backendLink}/campgrounds`);
    if (!campgroundRes.ok) {
      console.log("Campground response:", await campgroundRes.text());
      throw new Error("Failed to get campgrounds");
    }
    const campgroundData: APIResponseMultiple<Campground> =
      await campgroundRes.json();

    if (!campgroundData.data.length) {
      throw new Error("No campground found");
    }

    currentCampground = campgroundData.data[0];

    // Step 2: Create a booking
    const bookingRes = await request.post(
      `${backendLink}/campgrounds/${currentCampground._id}/bookings`,
      {
        headers: {
          Authorization: `Bearer ${backendToken}`,
          "Content-Type": "application/json",
        },
        data: {
          bookDate: "2026-01-01",
          bookEndDate: "2026-01-02",
        },
      }
    );

    if (!bookingRes.ok) {
      console.log("Booking response:", await bookingRes.text());
      throw new Error("Failed to create booking");
    }
    const bookingJson = await bookingRes.json();
    if (!bookingJson.data) throw new Error("Booking not created");

    currentBooking = bookingJson.data;

    // Step 3: Create a review for the booking
    reviewComment = "EDIT TEST " + Date.now();

    const reviewRes = await request.post(
      `${backendLink}/bookings/${currentBooking?._id}/review`,
      {
        headers: {
          Authorization: `Bearer ${backendToken}`,
          "Content-Type": "application/json",
        },
        data: {
          rating: 4,
          comment: reviewComment,
        },
      }
    );

    if (!reviewRes.ok) {
      console.log(await reviewRes.text());
      throw new Error("Failed to create review");
    }

    // Step 4: Navigate to the booking detail page
    await page.goto(`/bookings/${currentBooking?._id}`);
    await page.waitForLoadState("networkidle");
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

  test("should be able to edit own review", async ({ page }) => {
    const NEW_RATING = 5;
    const NEW_COMMENT = "EDITED REVIEW " + Date.now();

    // Navigate to review section
    await page.getByText("Review").scrollIntoViewIfNeeded();

    // Verify initial review is displayed
    const commentInput = page.getByTestId("comment-input");
    await expect(commentInput).toHaveValue(reviewComment);

    // Click edit button
    const editButton = page.getByTestId("edit-review");
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Verify form is in edit mode
    await expect(commentInput).toBeEnabled();

    // Update rating
    const ratingMUIComponent = page.getByTestId("star-rating");
    const ratingInput = ratingMUIComponent.locator(`input[type='radio'][value='${NEW_RATING}']`);
    const ratingInputLabel = ratingMUIComponent.locator(`label[for='${await ratingInput.getAttribute('id')}']`);
    await expect(ratingInputLabel).toBeVisible();
    await ratingInputLabel.click({ delay: 100 });

    // Update comment
    await commentInput.fill(NEW_COMMENT);
    await expect(commentInput).toHaveValue(NEW_COMMENT);

    // Click update button
    const updateButton = page.getByTestId("update-review");
    await expect(updateButton).toBeVisible();
    await updateButton.click();

    // Wait for update to complete - check that we're back in view mode
    await expect(commentInput).toBeDisabled();
    await expect(editButton).toBeVisible();
    await expect(updateButton).not.toBeVisible();

    // Verify the review is updated by checking the campground page
    await page.goto(`/campgrounds/${currentCampground?._id}`);

    const reviewCardLocator = page.getByTestId("review-card");
    await reviewCardLocator.first().waitFor({ state: 'visible' });

    const correctReviewCard = reviewCardLocator.filter({ has: page.getByText(NEW_COMMENT) });
    await expect(correctReviewCard).toBeVisible();

    const reviewCardRating = correctReviewCard.locator(`[aria-label='${NEW_RATING} Stars']`);
    await expect(reviewCardRating).toBeVisible();
  });

  test("should cancel edit when clicking cancel button", async ({ page }) => {
    const NEW_COMMENT = "CANCELLED EDIT " + Date.now();

    // Navigate to review section
    await page.getByText("Review").scrollIntoViewIfNeeded();

    // Click edit button
    const editButton = page.getByTestId("edit-review");
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Modify comment
    const commentInput = page.getByTestId("comment-input");
    await commentInput.fill(NEW_COMMENT);
    await expect(commentInput).toHaveValue(NEW_COMMENT);

    // Click cancel button
    const cancelButton = page.getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Verify changes are reverted
    await expect(commentInput).toHaveValue(reviewComment);
    await expect(editButton).toBeVisible();
  });

  test("should not be able to edit other user's review", async ({ browser, page }) => {
  if (!currentBooking || !currentCampground) throw new Error("Booking or campground missing");

  // Create another user context
  const user2Context = await browser.newContext({
    storageState: "playwright/.auth/user2.json",
  });
  const user2Page = await user2Context.newPage();

  // User2 navigates to the campground page where the review is public
  await user2Page.goto(`/campgrounds/${currentCampground._id}`);
  await user2Page.waitForURL(`**/campgrounds/${currentCampground._id}**`);
  await user2Page.waitForLoadState("networkidle");

  // Wait for review section to be visible
  const reviewHeading = user2Page.getByRole("heading", { name: /review/i });
  await expect(reviewHeading).toBeVisible({ timeout: 10000 });

  // Find the review card with a more lenient approach
  const reviewCardLocator = user2Page.getByTestId("review-card");
  
  // Wait with explicit timeout and error handling
  try {
    await reviewCardLocator.first().waitFor({ state: 'visible', timeout: 15000 });
  } catch (error) {
    console.log("No review cards found on campground page");
    throw new Error(`Review not visible on campground page: ${error}`);
  }

  const userReviewCard = reviewCardLocator.filter({ has: user2Page.getByText(reviewComment) });
  await expect(userReviewCard).toBeVisible({ timeout: 10000 });

  // Verify that User2 cannot edit the review
  const editButtons = userReviewCard.locator('[data-testid="edit-review"]');
  await expect(editButtons).not.toBeVisible();

  const deleteButtons = userReviewCard.locator('[data-testid="delete-review"]');
  await expect(deleteButtons).not.toBeVisible();

  await user2Context.close();
});
});