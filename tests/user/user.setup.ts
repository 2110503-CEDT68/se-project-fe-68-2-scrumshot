import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("User Login with Email and Password", async ({ page }) => {
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  if (!userEmail || !userPassword) {
    throw new Error("Missing USER_EMAIL or USER_PASSWORD in .env.local");
  }

  await page.goto('/signin');

  await page.getByPlaceholder('Email').fill(userEmail);
  await page.getByPlaceholder('Password').fill(userPassword);

  await page.getByText('Sign In').click();

  await page.waitForURL('/');

  await page.context().storageState({ path: authFile });
  
});
