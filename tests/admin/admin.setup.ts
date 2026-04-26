import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/admin.json";

setup("Admin Login with Email and Password", async ({ page }) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env.local");
  }

  await page.goto("/signin");

  await page.getByPlaceholder("Email").fill(adminEmail);
  await page.getByPlaceholder("Password").fill(adminPassword);

  await page.getByText("Sign In").click();

  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
