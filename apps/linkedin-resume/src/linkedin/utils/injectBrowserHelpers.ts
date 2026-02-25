/* eslint-disable max-lines-per-function */
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
      return Array.from(el.querySelectorAll('span'))
        .filter((span) => {
          return !span.className.includes('visually-hidden') && span.hasAttribute('aria-hidden')
        })

        .map((span) => {
          return (globalThis as any).__getTextWithBreaks(span)
        })
    }

    /**
     * Extracts media items (images, external links) from a LinkedIn detail list item.
     * Returns the media links and a list of span texts that belong to the media section
     * (filenames, captions, noise labels) so they can be filtered from content spans.
     *
     * Convention: the first <img> in a <li> is the entity logo and is skipped.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).__extractMedia = (
      li: Element,
    ): { mediaLinks: { title: string; url: string }[]; mediaTexts: string[] } => {
      const FILENAME_RE = /\.(jpe?g|png|gif|webp|svg|bmp|tiff?|pdf|doc|docx|pptx?|xlsx?|mp[34])$/i
      const mediaLinks: { title: string; url: string }[] = []

      // --- Collect non-logo images ---
      const allImgs = Array.from(li.querySelectorAll('img')) as HTMLImageElement[]
      const logoImg = allImgs[0] // first image is the entity/company logo
      const mediaImgUrls: string[] = []
      for (const img of allImgs) {
        if (img === logoImg) {
          continue
        }
        if (img.src) {
          mediaImgUrls.push(img.src)
        }
      }

      // --- Collect filename-matching visible spans ---
      const filenameTexts: string[] = []
      for (const span of li.querySelectorAll('span[aria-hidden="true"]')) {
        const txt = (span.textContent || '').trim()
        if (FILENAME_RE.test(txt)) {
          filenameTexts.push(txt)
        }
      }

      // Pair filenames with image URLs by position
      const pairCount = Math.max(filenameTexts.length, mediaImgUrls.length)
      for (let i = 0; i < pairCount; i++) {
        mediaLinks.push({ title: filenameTexts[i] ?? '', url: mediaImgUrls[i] ?? '' })
      }

      // --- Collect external / redirect links that are not image wrappers ---
      for (const a of li.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href') ?? ''
        const isRedirect = href.includes('/redirect')
        const isExternal = href.startsWith('http') && !href.includes('linkedin.com')
        if (!isRedirect && !isExternal) {
          continue
        }
        if (a.querySelector('img') && a.querySelector('img') !== logoImg) {
          continue
        }

        let url = href
        try {
          const u = new URL(href, location.origin)
          const redir = u.searchParams.get('url')
          if (redir) {
            url = redir
          }
        } catch {
          /* ignore malformed URLs */
        }
        const titleEl = a.querySelector('span[aria-hidden="true"]')
        const title = titleEl ? titleEl.textContent!.trim() : (a.textContent || '').trim()
        mediaLinks.push({ title, url })
      }

      // --- Build mediaTexts: everything from the first filename onward is media ---
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allSpans: string[] = (globalThis as any).__getVisibleSpans(li)
      const cutIdx = allSpans.findIndex((s: string) => {
        return FILENAME_RE.test(s)
      })
      const mediaTexts = cutIdx !== -1 ? allSpans.slice(cutIdx) : []

      // Also mark the common noise label that appears in media sections
      if (!mediaTexts.includes('Other contributors')) {
        // Check if it appears after any media link title in the full span list
        const ocIdx = allSpans.indexOf('Other contributors')
        if (ocIdx !== -1) {
          mediaTexts.push('Other contributors')
        }
      }

      return { mediaLinks, mediaTexts }
    }
  })
}
