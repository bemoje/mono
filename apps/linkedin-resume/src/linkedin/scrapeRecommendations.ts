import type { Browser } from 'puppeteer'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { CliOptions } from '../types/CliOptions'
import { onScrapeError } from './utils/onScrapeError'
import { ResumeRecommendation } from '../types/Resume'
import { scrapeOutputJson } from './utils/scrapeOutputJson'
import { userConfigFile } from '../userConfigFile'
import { getPageUrl } from './utils/getPageUrl'
import { Logger } from '@mono/node'

export async function scrapeRecommendations(browser: Browser, options: CliOptions, logger: Logger): Promise<void> {
  const page = await browser.newPage()

  const recommendations: ResumeRecommendation[] = []

  try {
    const username = userConfigFile.load().username
    await page.goto(getPageUrl(username, 'recommendations'), {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch {
      logger.warn('No recommendations section found or it took too long to load.')
      throw 'ignore'
    }

    await autoScroll(page)
    await patchEsbuildHelpers(page)

    const rawEntries = await page.evaluate(() => {
      const container = document.querySelector('.scaffold-finite-scroll__content')
      if (!container) return []
      const topLevelItems = Array.from(container.querySelector('ul')?.children ?? [])

      const getVisibleSpans = (el: Element): string[] => {
        return Array.from(el.querySelectorAll('span'))
          .filter((span) => !span.className.includes('visually-hidden') && span.hasAttribute('aria-hidden'))
          .map((span) => span.textContent!.trim())
      }

      return topLevelItems.map((li) => ({
        spans: getVisibleSpans(li),
        logoUrl: li.querySelector('img')?.src ?? '',
      }))
    })

    // Each recommendation entry spans:
    // [0] = recommender name
    // [1] = connection degree, e.g. "· 1st" (skip)
    // [2] = recommender headline/title
    // [3] = date + relationship, e.g. "June 13, 2025, Peter managed Benjamin directly"
    // [4] = visibility, e.g. "All LinkedIn members"
    // [5] = "On"/"Off" - only include recommendations toggled "On"
    // [6+] = recommendation body text (skip per user request)
    const DATE_RE = /^([A-Z][a-z]+\s+\d{1,2},\s*\d{4})/
    const NOISE_RE = /^(· \d|All LinkedIn members$|^On$|^Off$)/

    for (const { spans, logoUrl } of rawEntries) {
      if (spans.length < 3) continue

      // Check visibility toggle: find "All LinkedIn members" and check the next span
      const visIdx = spans.indexOf('All LinkedIn members')
      if (visIdx !== -1 && spans[visIdx + 1] === 'Off') continue

      const name = spans[0]
      if (!name) continue

      // Skip connection degree indicator (e.g. "· 1st")
      let idx = 1
      if (spans[idx]?.startsWith('·')) idx++

      const headline = spans[idx++] ?? ''

      let date = ''
      let relationship = ''

      // Look for the date + relationship span
      for (let i = idx; i < spans.length; i++) {
        const s = spans[i]
        if (NOISE_RE.test(s)) continue

        const dateMatch = s.match(DATE_RE)
        if (dateMatch && !date) {
          date = dateMatch[1]
          const after = s
            .slice(dateMatch[0].length)
            .replace(/^[,\s]+/, '')
            .trim()
          if (after) relationship = after
          break
        }
      }

      recommendations.push({
        name,
        headline,
        date,
        relationship,
        logoUrl,
      })
    }
  } catch (e) {
    onScrapeError(e, 'recommendations', options, logger)
  } finally {
    await scrapeOutputJson(recommendations, 'recommendations', logger, options)
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
