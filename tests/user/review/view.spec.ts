import { test, expect } from '@playwright/test';


test('User should see the correct number of reviews and review cards', async ({ page }) => {
  
  // Navigate to campgrounds page first
  await page.goto('/campgrounds');
  
  // Click on the first campground card's "Book" button to navigate to its detail page
  await page.locator('a[href*="/campgrounds/"] button').first().click();
  
  // 1. เช็กว่าหัวข้อมาแล้ว
  const reviewHeading = page.getByRole('heading', { name: 'Review :' });
  await expect(reviewHeading).toBeVisible();

  // 2. ดึงตัวเลขจาก Badge สีม่วง
  const headerContainer = page.locator('div.flex.items-center.gap-3')
    .filter({ has: reviewHeading });
  const countBadge = headerContainer.locator('div.bg-\\[\\#a865a8\\]');
  
  // อ่านค่าตัวเลข (เช่น ได้คำว่า "3")
  const countText = await countBadge.textContent();
  const expectedCount = parseInt(countText || '0', 10);

  // 3. ตรวจสอบการแสดงผลของการ์ดรีวิว
  // หาการ์ดทั้งหมดที่มีบนหน้าจอ
  const reviewCards = page.locator('div.border.p-5.rounded-md.border-gray-200');

  if (expectedCount > 0) {
    // ถ้าตัวเลขบอกว่ามีรีวิว จำนวนการ์ดบนหน้าจอก็ต้องมีเท่ากัน
    await expect(reviewCards).toHaveCount(expectedCount);
    
    // เช็กการ์ดใบแรกขำๆ ว่ามีข้อมูลแสดงอยู่จริงไหม
    await expect(reviewCards.first()).toBeVisible();
  } else {
    // ถ้าตัวเลข Badge เป็น 0 หน้าจอก็ต้องไม่มีการ์ดรีวิวโผล่มาเลย
    await expect(reviewCards).toHaveCount(0);
  }
});