import { expect } from "@playwright/test";
import { test } from "../../fixtures";
import { decode } from "next-auth/jwt";
import {
  APIResponseMultiple,
  APIResponseSingle,
  Booking,
  Campground,
} from "@/libs/types";

let currentBooking: Booking | null = null;
let currentCampground: Campground | null = null;

// backendLink and session is injected by the fixture defined at ../fixtures.ts
test.describe("Review creation", () => {
  test.beforeEach(async ({ page, request, backendLink, session }) => {
    // Retrieve the cookie and decode it with the secret
    const { backendToken } = session;

    // find a campground to book
    const campgroundGetAllResponse = await request.get(
      `${backendLink}/campgrounds`,
    );
    if (!campgroundGetAllResponse.ok)
      throw new Error("Failed to get all campgrounds");
    const campgroundGetAllData: APIResponseMultiple<Campground> =
      await campgroundGetAllResponse.json();
    if (campgroundGetAllData.count === 0)
      throw new Error("No campground found");

    currentCampground = campgroundGetAllData.data[0];

    // Set the backend token in the page context
    const createBookingResponse = await request.post(
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
      },
    );

    if (!createBookingResponse.ok) throw new Error("Failed to create booking");
    currentBooking = (await createBookingResponse.json()).data;
    if (!currentBooking) throw new Error("Failed to create booking");

    await page.goto(`/bookings/${currentBooking._id}`);
  });

  test.afterEach(async ({ page, request, backendLink, session }) => {
    // Booking teardown
    if (currentBooking) {
      const deleteBookingResponse = await request.delete(
        `${backendLink}/bookings/${currentBooking._id}`,
        {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        },
      );
      if (!deleteBookingResponse.ok)
        throw new Error("Failed to delete booking");
    }
  });

  test("should show ui to create review", async ({ page }) => {
    const reviewHeading = page.getByRole("heading", { name: "Review" });
    await expect(reviewHeading).toBeVisible();

    const rateInput = page.getByTestId("star-rating");
    await expect(rateInput).toBeVisible();

    const commentInput = page.getByTestId("comment-input");
    await expect(commentInput).toBeVisible();
    await expect(commentInput).toBeDisabled(); // First page load it should be disabled`
    await expect(commentInput).toBeEmpty(); // Its a new booking so no review yet

    const editButton = page.getByTestId("edit-review"); // On page load it should have only edit button
    await expect(editButton).toBeVisible();
    
    await editButton.click();
    await expect(commentInput).toBeEnabled();

    const createButton = page.getByTestId("create-review");
    await expect(createButton).toBeVisible();
    
  });
  
  test("should be able to create review", async ({ page }) => {
    const RATING = 4;
    const COMMENT = "PLAYWRIGHT USER TEST REVIEW AT TIME " + new Date().getTime()
    
    const commentInput = page.getByTestId("comment-input");
    const editButton = page.getByTestId("edit-review");
    await editButton.click();
    
    const ratingMUIComponent = page.getByTestId("star-rating");
    const ratingInput = ratingMUIComponent.locator(`input[type='radio'][value='${RATING}']`);
    const ratingInputLabel = ratingMUIComponent.locator(`label[for='${await ratingInput.getAttribute('id')}']`)
    
    await expect(ratingInputLabel).toBeVisible(); // We need to click the label becuase the button is hidden
    await ratingInputLabel.click({delay: 100});
    
    await commentInput.fill(COMMENT);
    await expect(commentInput).toHaveValue(COMMENT);
    
    const createButton = page.getByTestId("create-review");
    await createButton.click();
    
    await expect(commentInput).toBeDisabled();
    await expect(editButton).toBeVisible();
    await expect(createButton).not.toBeVisible(); 
    
    // Check if the review is saved in the backend
    await page.goto(`/campgrounds/${currentCampground?._id}`);
    
    const reviewCardLocator = page.getByTestId("review-card");
    await reviewCardLocator.first().waitFor({ state: 'visible' }); // ensure at least one has loaded
    
    const correctReviewCard = reviewCardLocator.filter({ has: page.getByText(COMMENT) });
    await expect(correctReviewCard).toBeVisible(); // is shown
    
    const reviewCardRating = correctReviewCard.locator(`[aria-label='${RATING} Stars']`);
    await expect(reviewCardRating).toBeVisible(); // correct rating (I physically don't know how to check this other than this method :/)
    
  });
});