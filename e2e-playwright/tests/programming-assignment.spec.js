const { test, expect } = require('@playwright/test');

test("Server responds with a page with the title 'Programming assignments'", async ({
  page,
}) => {
  await page.goto('/');
  expect(await page.title()).toBe('Programming assignments');
});

test('Can create assignment submission with passing test', async ({ page }) => {
  await page.goto('/');
  await page
    .getByLabel('Your code answer')
    .fill("def hello (): return 'Hello'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
});

test('Can create assignment submission with failed test', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your code answer').fill("def hello (): return 'Hi!'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-red-500')).toHaveText('Incorrect');
});

test('Submission with passing text and enable the next button with confirmation of the current assignment statement', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByTestId('input-answer')
    .fill("def hello (): \n    hello = 'Hello' \n    return hello");
  await page.getByTestId('submit-answer-btn').click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
  await page.getByTestId('next-problem-btn').click();
  await expect(page.locator('h1')).toHaveText('Problem # 2: Hello world');
});
