const { test, expect } = require('@playwright/test');

test("Server responds with a page with the title 'Programming assignments'", async ({
  page,
}) => {
  await page.goto('/');
  expect(await page.title()).toBe('Programming assignments');
});

test('Can create assignment submission with passing test increasing the points from 0 to 100', async ({
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
});

test('Can create assignment submission with failed test', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your code answer').fill("def hello (): return 'Hi!'");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.locator('p.text-red-500')).toHaveText('Incorrect');
});

test('Submission with passing text and enable the next button with confirming the user is on the next new assignment', async ({
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

test('Answering two correct questions subsequently, increasing the points from 0 to 200. Correct answer will increase the points and enable the next button to the new question', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByTitle('points')).toHaveText('Points: 0');
  await page
    .getByLabel('Your code answer')
    .fill("def hello (): \n    sample = 'Hello' \n    sample hello");
  await page.getByRole('button', { name: /Submit your answer/i }).click();
  await expect(page.getByTitle('points')).toHaveText('Points: 100');
  await page.getByTestId('next-problem-btn').click();
  await expect(page.locator('h1')).toHaveText('Problem # 2: Hello world');
 await page
   .getByLabel('Your code answer')
   .fill("def hello (): \n    sample = 'Hello world!' \n    sample hello");
  await page.getByTestId('submit-answer-btn').click();
  await expect(page.getByTitle('points')).toHaveText('Points: 200');
});
