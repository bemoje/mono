import { expect } from '@playwright/test'
import { test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Office/i);

  // Wait for the heading
  const heading = page.getByRole('heading', { name: 'DR.DK Nyheder' })
  await expect(heading).toBeVisible()
})
