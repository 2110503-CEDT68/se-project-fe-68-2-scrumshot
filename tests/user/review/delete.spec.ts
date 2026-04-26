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

test.describe("Review deletion", () => {

  test.beforeEach(async ({ page, request, backendLink, session }) => {
    const { backendToken } = session;

    currentCampground = null;
    currentBooking = null;

    // Step 1: Retrieve campground list
    const campgroundRes = await request.get(`${backendLink}/campgrounds`);
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
          bookDate: "2023-01-01",
          bookEndDate: "2023-01-02",
        },
      }
    );

    const bookingJson = await bookingRes.json();
    if (!bookingJson.data) throw new Error("Booking not created");

    currentBooking = bookingJson.data;

    // Step 3: Create a review for the booking
    reviewComment = "DELETE TEST " + Date.now();

    const reviewRes = await request.post(
      `${backendLink}/bookings/${currentBooking._id}/review`,
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
    await page.goto(`/bookings/${currentBooking._id}`);
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

  // Test 1: Do not modify this test (as requested)
  test("should be able to delete review", async ({ page }) => {
    await page.getByText("Review").scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: "Edit", exact: true }).click();

    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(
      page.getByText("Are you sure you want to delete this review?")
    ).toBeVisible();

    await page.locator("div.fixed").getByRole("button", {
      name: "Delete",
      exact: true,
    }).click();

    await expect(page.getByText(reviewComment)).not.toBeVisible();
  });

  // Test 2: Verify warning message when deleting a review modified by an admin
  test("should show warning when deleting admin-edited review", async ({ browser }) => {
    if (!currentBooking) throw new Error("Booking missing");

    // Step 1: Admin modifies the review
    const adminContext = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminPage = await adminContext.newPage();

    await adminPage.goto(`/bookings/${currentBooking._id}`);
    await adminPage.waitForLoadState("networkidle");

    const reviewHeading = adminPage.getByRole("heading", { name: "Review" });
    await expect(reviewHeading).toBeVisible();
    await reviewHeading.scrollIntoViewIfNeeded();

    await adminPage.getByRole("button", { name: "Edit", exact: true }).click();

    const textbox = adminPage.getByRole("textbox", { name: "Review text" });
    await expect(textbox).toBeVisible();

    await textbox.fill("ADMIN EDITED");

    const updateBtn = adminPage.getByRole("button", { name: "Update" });
    await expect(updateBtn).toBeVisible();

    // Ensure the update request is completed before proceeding
    await Promise.all([
      adminPage.waitForResponse(res =>
        res.url().includes(`/bookings/${currentBooking!._id}/review`)
      ),
      updateBtn.click(),
    ]);

    await adminContext.close();

    // Step 2: User attempts to delete the modified review
    const userContext = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const userPage = await userContext.newPage();

    await userPage.goto(`/bookings/${currentBooking._id}`);
    await userPage.waitForLoadState("networkidle");

    // Wait until the updated content is visible
    await expect(
      userPage.getByText("ADMIN EDITED")
    ).toBeVisible();

    const deleteBtn = userPage.getByRole("button", { name: "Delete", exact: true });
    await expect(deleteBtn).toBeVisible();

    await deleteBtn.click();

    const modal = userPage.locator("div.fixed");
    await expect(modal).toBeVisible();

    await expect(modal).toContainText(
      "Since an admin has modified this review"
    );

    await modal.getByRole("button", { name: "Delete", exact: true }).click();

    await userContext.close();
  });
});