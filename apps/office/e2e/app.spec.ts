import { expect } from '@playwright/test'
import { test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Office/i)

  // Wait for the heading
  const heading = page.getByRole('heading', { name: 'DR.DK Nyheder' })
  await expect(heading).toBeVisible()
})

test('has at least one article', async ({ page }) => {
  await page.goto('/')
  const firstArticle = page.locator('article').first()
  await expect(firstArticle).toBeVisible()
})

test('article expands summary text when clicked', async ({ page }) => {
  await page.goto('/')
  const firstArticle = page.locator('article').first()

  const firstArticleText = await firstArticle.textContent()
  expect(firstArticleText).toBeTruthy()

  await firstArticle.click()
  const firstArticleTextPlusSummary = await firstArticle.textContent()
  expect(firstArticleTextPlusSummary).toBeTruthy()

  const firstArticleTextLen = firstArticleText!.length
  expect(firstArticleTextLen).toBeGreaterThan(0)

  const firstArticleTextPlusSummaryLen = firstArticleTextPlusSummary!.length
  expect(firstArticleTextPlusSummaryLen).toBeGreaterThan(0)

  expect(firstArticleTextLen).toBeLessThan(firstArticleTextPlusSummaryLen)
})
