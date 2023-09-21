const { test, expect } = require('@playwright/test');

test("Server responds with a page with the title 'Programming assignments'", async ({
  page,
}) => {
  await page.goto('/');
  expect(await page.title()).toBe('Programming assignments');
});

test('Can create assignment submission (Correct)', async ({ page }) => {
  await page.goto('/');
  await page
    .getByLabel('Your code answer')
    .fill("def hello (): return 'Hello'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
});

test('Can create assignment submission (Incorrect)', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your code answer').fill("def hello (): return 'Hi!'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-red-500')).toHaveText('Incorrect');
});
