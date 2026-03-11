import { test, expect } from '@playwright/test';

test('boards page loads successfully', async ({ page }) => {
  await page.goto('/boards');

  // Check that the header is visible
  await expect(page.getByText('My Boards')).toBeVisible();
  await expect(page.getByText('Manage your whiteboard boards')).toBeVisible();
});

test('create board form is visible', async ({ page }) => {
  await page.goto('/boards');

  const input = page.getByPlaceholder('New board name...');
  const button = page.getByText('Create Board');

  await expect(input).toBeVisible();
  await expect(button).toBeVisible();
});

test('can type in board name input', async ({ page }) => {
  await page.goto('/boards');

  const input = page.getByPlaceholder('New board name...');
  await input.fill('Test Board');

  await expect(input).toHaveValue('Test Board');
});

test('empty state message is shown when no boards', async ({ page }) => {
  await page.goto('/boards');

  await expect(page.getByText('No boards yet')).toBeVisible();
  await expect(page.getByText('Create your first board to get started')).toBeVisible();
});
