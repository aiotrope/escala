const { test, expect } = require('@playwright/test');

test("Server responds with a page with the title 'Programming assignments'", async ({
  page,
}) => {
  await page.goto('/');
  expect(await page.title()).toBe('Programming assignments');
});

test('Sequential points and assignments increment, points starts at 0 and ends at 200; all passing test', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Problem # 1: Hello');
  await expect(page.getByTitle('points')).toHaveText('Points: 0');
  await page
    .getByLabel('Your code answer')
    .fill("def hello (): return 'Hello'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
  await expect(page.getByTitle('points')).toHaveText('Points: 100');
  await page.getByTestId('next-problem-btn').click();
  await expect(page.locator('h1')).toHaveText('Problem # 2: Hello world');
  await page
    .getByLabel('Your code answer')
    .fill("def hello (): return 'Hello world!'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
  await expect(page.getByTitle('points')).toHaveText('Points: 200');
});

test('Respond "Incorect" on failed test', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your code answer').fill("def hello (): return 'Hi!'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-red-500')).toHaveText('Incorrect');
});

test('Respond "Correct" on passing test', async ({ page }) => {
  await page.goto('/');
  await page
    .getByLabel('Your code answer')
    .fill("def hello (): \n    hello = 'Hello world!' \n    return hello");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
});

test('Passes test will allow user to move to next assignment', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByTestId('input-answer')
    .fill("def hello (): \n    sample = 'Hello world!' \n    return sample");
  await page.getByTestId('submit-answer-btn').click();
  await expect(page.locator('p.text-green-500')).toHaveText('Correct');
  await expect(page.locator('h1')).toHaveText('Problem # 2: Hello world');
  await page.getByTestId('next-problem-btn').click();
  await expect(page.locator('h1')).toHaveText('Problem # 3: Sum');
});
