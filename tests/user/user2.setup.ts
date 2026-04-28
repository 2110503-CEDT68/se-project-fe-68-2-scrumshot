import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user2.json";

setup("User2 Login with Email and Password", async ({ page }) => {
  const userEmail = process.env.USER2_EMAIL;
  const userPassword = process.env.USER2_PASSWORD;

  if (!userEmail || !userPassword) {
    throw new Error("Missing USER2_EMAIL or USER2_PASSWORD in .env.local");
  }

  await page.goto("/signin");

  await page.getByPlaceholder("Email").fill(userEmail);
  await page.getByPlaceholder("Password").fill(userPassword);

  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});