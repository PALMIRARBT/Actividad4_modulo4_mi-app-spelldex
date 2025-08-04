import { test, expect } from "@playwright/test";

test("the Class Grid has 6 buttons", async ({ page }) => {
  await page.goto("/");

  const classGrid = page.getByRole("grid", {
    name: "Class Grid",
  });

  await expect(classGrid).toBeVisible();
  const items = classGrid.getByRole("button");
  await expect(items).toHaveCount(6);

  await expect(classGrid).toHaveScreenshot("class-grid.png");
});
