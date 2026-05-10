import type { Browser } from 'playwright'
import type { BrowserContext } from 'playwright'
import type { LaunchOptions } from 'playwright'
import type { Page } from 'playwright'
import { chromium } from 'playwright'
import { forEachAsync } from 'es-toolkit'

async function browserContextTeardown(context: BrowserContext) {
  await forEachAsync(context.pages(), async (page) => {
    try {
      await page.close()
    } catch (_) {
      //
    }
  })
  await context.close()
}

async function browserTeardown(browser: Browser) {
  await forEachAsync(browser.contexts(), async (context) => {
    try {
      await browserContextTeardown(context)
    } catch (_) {
      //
    }
  })
  await browser.close()
}

async function browserContextPageSession<PageRet>(context: BrowserContext, fn: (page: Page) => Promise<PageRet>) {
  const page = await context.newPage()
  try {
    return await fn(page)
  } finally {
    await page.close()
  }
}

async function browserContextSession<CtxRet>(
  browser: Browser,
  options: LaunchOptions,
  fn: (args: {
    context: BrowserContext
    pageSession: <PageRet>(fn: (page: Page) => Promise<PageRet>) => Promise<PageRet>
  }) => Promise<CtxRet>
) {
  const context = await browser.newContext(options)
  try {
    return await fn({
      context,
      pageSession: async <PageRet>(fn: (page: Page) => Promise<PageRet>) =>
        await browserContextPageSession<PageRet>(context, fn),
    })
  } finally {
    await browserContextTeardown(context)
  }
}

/**
 *
 *
 * @example
 * ```ts
 * await browserSession({}, async ({ contextSession }) => {
 *   return await contextSession({}, async ({ context, pageSession }) => {
 *     context.setDefaultTimeout(30000)
 *     context.setDefaultNavigationTimeout(30000)
 *     return await pageSession(async (page) => {
 *       await page.goto('https://example.com')
 *       return await page.title()
 *     })
 *   })
 * })
 * ```
 */
export async function browserSession<Ret>(
  options: LaunchOptions,
  browserCallback: (args: {
    browser: Omit<Browser, 'newPage' | 'newContext'>
    contextSession: <CtxRet>(
      options: LaunchOptions,
      fn: (args: {
        context: BrowserContext
        pageSession: <PageRet>(fn: (page: Page) => Promise<PageRet>) => Promise<PageRet>
      }) => Promise<CtxRet>
    ) => Promise<CtxRet>
  }) => Promise<Ret>
) {
  const browser = await chromium.launch(options)
  try {
    return await browserCallback({
      browser,
      contextSession: async (options, fn) => await browserContextSession(browser, options, fn),
    })
  } finally {
    await browserTeardown(browser)
  }
}
