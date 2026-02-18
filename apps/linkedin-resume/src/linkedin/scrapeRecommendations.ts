import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { CliOptions } from '../types/CliOptions'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { DIST_PATH } from '../constants'
import { prettyStackTrace } from 'libs/stacktrace/src/prettyStackTrace'
import { toError } from 'libs/node/src/toError'

interface RecommendationEntry {
  name: string
  headline: string
  date: string
  relationship: string
  logoUrl: string
}

export async function scrapeRecommendations(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  const recommendations: RecommendationEntry[] = []

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}/details/recommendations/?locale=en_US`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch (error) {
      console.warn('No recommendations section found or it took too long to load.')
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

    if (options.debug) {
      const debugPath = join('.temp', 'recommendations-raw-debug.json')
      await fs.outputFile(debugPath, JSON.stringify(rawEntries, null, 2))
      console.log(`Wrote raw recommendation spans to ${debugPath}`)
    }

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
    const error = toError(e)
    error.message = 'Error scraping recommendations: ' + error.message
    console.error(options.debug ? prettyStackTrace(error) : error.message)
  } finally {
    const outPath = join(DIST_PATH, 'recommendations-scraped.json')
    await fs.outputFile(outPath, JSON.stringify(recommendations, null, 2))
    console.log(`Wrote ${recommendations.length} recommendations to ${outPath}`)

    if (!options.keepOpen) {
      await page.close()
    }
  }
}
