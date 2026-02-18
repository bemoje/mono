import type { Page } from 'puppeteer'

/**
 * Injects a no-op `__name` polyfill into the browser page context.
 *
 * When running under tsx/esbuild with `keepNames`, named function declarations
 * and const arrow functions are wrapped with `__name(fn, "name")` calls. These
 * references are serialized into the browser by Puppeteer's `page.evaluate()`,
 * where `__name` does not exist.
 *
 * Call this once per page, after navigation and before any `page.evaluate()`
 * that contains named functions or named arrow consts.
 */
export async function patchEsbuildHelpers(page: Page): Promise<void> {
  await page.evaluate('globalThis.__name = (fn) => fn')
}
