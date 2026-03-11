import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Check that the header is visible
  await expect(page.getByText('Whiteboard')).toBeVisible();

  // Check that toolbar is visible
  await expect(page.getByTitle('Pen')).toBeVisible();
  await expect(page.getByTitle('Eraser')).toBeVisible();
  await expect(page.getByTitle('Shape')).toBeVisible();
  await expect(page.getByTitle('Text')).toBeVisible();
  await expect(page.getByTitle('Sticky Note')).toBeVisible();
});

test('drawing tools are clickable', async ({ page }) => {
  await page.goto('/');

  // Click on each drawing tool
  await page.getByTitle('Pen').click();
  await expect(page.getByTitle('Pen')).toHaveClass(/bg-blue-100/);

  await page.getByTitle('Eraser').click();
  await expect(page.getByTitle('Eraser')).toHaveClass(/bg-blue-100/);

  await page.getByTitle('Shape').click();
  await expect(page.getByTitle('Shape')).toHaveClass(/bg-blue-100/);
});

test('color picker works', async ({ page }) => {
  await page.goto('/');

  const colorPicker = page.locator('input[type="color"]');
  await expect(colorPicker).toBeVisible();

  await colorPicker.fill('#ff0000');
  await expect(colorPicker).toHaveValue('#ff0000');
});

test('brush size slider works', async ({ page }) => {
  await page.goto('/');

  const slider = page.locator('input[type="range"]');
  await expect(slider).toBeVisible();

  const initialValue = await slider.inputValue();
  await slider.fill('20');
  const newValue = await slider.inputValue();

  expect(newValue).toBe('20');
});

test('export button is visible', async ({ page }) => {
  await page.goto('/');

  const exportButton = page.getByText('Export');
  await expect(exportButton).toBeVisible();
});

test('save button is visible', async ({ page }) => {
  await page.goto('/');

  const saveButton = page.getByText('Save');
  await expect(saveButton).toBeVisible();
});
