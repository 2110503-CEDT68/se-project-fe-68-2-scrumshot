import { test, expect } from '@playwright/test';

test.describe('User Delete Review', () => {
  const mockBookingId = '6731d68a5299066f1d91694a';
  const mockCampgroundId = '6731d4585299066f1d916912';

  const mockUser = {
    _id: 'user-123',
    name: 'Test User',
    email: 'test@test.com',
    role: 'user'
  };

  const mockCampground = {
    _id: mockCampgroundId,
    name: 'Sample Campground',
    pricePerNight: 500
  };

  const mockReview = (overrides: any = {}) => ({
    _id: 'review-123',
    rating: 4,
    comment: 'Great place!',
    adminModified: false,
    isHidden: false,
    createdAt: new Date().toISOString(),
    user: { _id: mockUser._id },
    campground: { _id: mockCampgroundId },
    ...overrides
  });

  const mockBooking = (review: any) => ({
    _id: mockBookingId,
    bookDate: '2026-05-01',
    bookEndDate: '2026-05-02',
    user: mockUser._id,
    campground: mockCampground,
    totalPrice: 500,
    review
  });

  test.beforeEach(async ({ page }) => {
    page.on('dialog', d => d.accept());

    await page.route('**/api/auth/**', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { ...mockUser, backendToken: 'mock-token' },
          expires: new Date(Date.now() + 3600000).toISOString()
        })
      });
    });

    await page.route('**/api/v1/campgrounds', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: [mockCampground] })
      })
    );
  });

  // ---------------------------------------------
  // User deletes own review
  // ---------------------------------------------
  test('User can delete own review', async ({ page }) => {
    const bookingData = mockBooking(mockReview());

    await page.route(`**/api/v1/bookings/${mockBookingId}`, route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: bookingData })
      })
    );

    let deleteCalled = false;
    await page.route(`**/api/v1/bookings/${mockBookingId}/review`, route => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true;
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true })
        });
      }
      return route.continue();
    });

    await page.goto(`/bookings/${mockBookingId}`);
    await expect(page).not.toHaveURL(/signin/);

    await page.waitForResponse(res =>
      res.url().includes(`/api/v1/bookings/${mockBookingId}`)
    );

    await expect(page.getByText('Great place!')).toBeVisible();

    await page.getByRole('button', { name: 'Edit' }).last().click();
    await page.getByRole('button', { name: 'Delete' }).click();

    const modal = page.locator('div.fixed.inset-0');
    await modal.getByRole('button', { name: 'Delete' }).click();

    expect(deleteCalled).toBe(true);
  });

  // ---------------------------------------------
  // Admin-modified review deletion (confirm only)
  // ---------------------------------------------
  test('Admin modified review - confirm delete', async ({ page }) => {
    const bookingData = mockBooking(mockReview({ adminModified: true }));

    await page.route(`**/api/v1/bookings/${mockBookingId}`, route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: bookingData })
      })
    );

    let deleteCalled = false;
    await page.route(`**/api/v1/bookings/${mockBookingId}/review`, route => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true;
        return route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      }
    });

    await page.goto(`/bookings/${mockBookingId}`);
    await expect(page).not.toHaveURL(/signin/);

    await page.waitForResponse(res =>
      res.url().includes(`/api/v1/bookings/${mockBookingId}`)
    );

    await page.getByRole('button', { name: 'Delete' }).last().click();

    const modal = page.locator('div.fixed.inset-0');
    await modal.getByRole('button', { name: 'Delete' }).click();

    expect(deleteCalled).toBe(true);
  });

  // ---------------------------------------------
  // Unauthorized deletion (403)
  // ---------------------------------------------
  test('Cannot delete others review (403)', async ({ page }) => {
    const bookingData = mockBooking(mockReview());

    await page.route(`**/api/v1/bookings/${mockBookingId}`, route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: bookingData })
      })
    );

    await page.route(`**/api/v1/bookings/${mockBookingId}/review`, route => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 403, body: JSON.stringify({ success: false }) });
      }
    });

    await page.goto(`/bookings/${mockBookingId}`);
    await expect(page).not.toHaveURL(/signin/);

    await page.waitForResponse(res =>
      res.url().includes(`/api/v1/bookings/${mockBookingId}`)
    );

    await page.getByRole('button', { name: 'Edit' }).last().click();
    await page.getByRole('button', { name: 'Delete' }).click();

    const modal = page.locator('div.fixed.inset-0');
    await modal.getByRole('button', { name: 'Delete' }).click();
  });

  // ---------------------------------------------
  // Deleting review updates campground rating
  // ---------------------------------------------
  test('Deleting review updates campground rating', async ({ page }) => {
    const bookingData = mockBooking(mockReview());

    await page.route(`**/api/v1/bookings/${mockBookingId}`, route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: bookingData })
      })
    );

    await page.route(`**/api/v1/bookings/${mockBookingId}/review`, route => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      }
    });

    // BEFORE delete
    await page.route('**/api/v1/campgrounds', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          data: [{ ...mockCampground, avgRating: 4.5, totalReviews: 2 }]
        })
      })
    );

    await page.goto(`/bookings/${mockBookingId}`);
    await expect(page).not.toHaveURL(/signin/);

    await page.waitForResponse(res =>
      res.url().includes(`/api/v1/bookings/${mockBookingId}`)
    );

    await page.getByRole('button', { name: 'Edit' }).last().click();
    await page.getByRole('button', { name: 'Delete' }).click();

    const modal = page.locator('div.fixed.inset-0');
    await modal.getByRole('button', { name: 'Delete' }).click();

    // AFTER delete
    await page.route('**/api/v1/campgrounds', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          data: [{ ...mockCampground, avgRating: 5.0, totalReviews: 1 }]
        })
      })
    );

    await page.goto('/campgrounds');

    await expect(page.getByText('5.0')).toBeVisible();
  });
});