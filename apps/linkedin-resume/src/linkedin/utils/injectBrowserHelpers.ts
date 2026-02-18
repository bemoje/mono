import type { Page } from 'puppeteer'

/**
 * Injects shared DOM helper functions into the browser page context.
 * Call once per page, after navigation, before any page.evaluate that needs them.
 */
export async function injectBrowserHelpers(page: Page): Promise<void> {
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).__getTextWithBreaks = (el: Element): string => {
      let text = ''
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent
        } else if (node.nodeName === 'BR') {
          text += '\n'
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          text += (globalThis as any).__getTextWithBreaks(node as Element)
        }
      }
      return text.trim()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).__getVisibleSpans = (el: Element): string[] => {
      return (
        Array.from(el.querySelectorAll('span'))
          .filter((span) => !span.className.includes('visually-hidden') && span.hasAttribute('aria-hidden'))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((span) => (globalThis as any).__getTextWithBreaks(span))
      )
    }
  })
}
