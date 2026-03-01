/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import type { Browser } from 'puppeteer'
import type { CliOptions } from '../types/CliOptions'
import type { Logger } from '@mono/node'
import type { ResumeWork } from '../types/Resume'
import { autoScroll } from './utils/autoScroll'
import { getPageUrl } from './utils/getPageUrl'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { onScrapeError } from './utils/onScrapeError'
import { parseDate } from './utils/parseDate'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { scrapeOutputJson } from './utils/scrapeOutputJson'
import { userConfigFile } from '../userConfigFile'

export async function scrapeExperience(browser: Browser, options: CliOptions, logger: Logger): Promise<void> {
  const page = await browser.newPage()

  const experiences: ResumeWork[] = []

  try {
    const username = userConfigFile.load().username
    await page.goto(getPageUrl(username, 'experience'), { waitUntil: 'domcontentloaded', timeout: 20000 })

    // Wait for the experience list to appear
    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch {
      logger.warn('No experience section found or it took too long to load.')
      // eslint-disable-next-line no-throw-literal
      throw 'ignore'
    }

    // Scroll to load all lazy-loaded entries
    await autoScroll(page)
    await patchEsbuildHelpers(page)
    await injectBrowserHelpers(page)
    // Extract visible spans from each top-level experience entry
    const rawEntries = await page.evaluate(() => {
      const container = document.querySelector('.scaffold-finite-scroll__content')
      if (!container) {
        return []
      }
      const topLevelItems = Array.from(container.querySelector('ul')?.children ?? [])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getVisibleSpans = (globalThis as any).__getVisibleSpans as (el: Element) => string[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractMedia = (globalThis as any).__extractMedia as (el: Element) => {
        mediaLinks: { title: string; url: string }[]
        mediaTexts: string[]
      }

      return topLevelItems.map((li) => {
        const { mediaLinks, mediaTexts } = extractMedia(li)
        const mediaTextSet = new Set(mediaTexts)
        const spans = getVisibleSpans(li).filter((text) => {
          return !mediaTextSet.has(text)
        })
        return { spans, logoUrl: li.querySelector('img')?.src ?? '', mediaLinks }
      })
    })

    // Detect whether entry is grouped (multi-role) or single-role, then parse
    const DATE_RANGE_RE = /^[A-Z][a-z]{2}\s+\d{4}\s*-\s*([A-Z][a-z]{2}\s+\d{4}|Present)\s*·/
    const DURATION_ONLY_RE = /^\d+\s*(yrs?|mos?)\b/
    const WORK_TYPE_RE =
      /^(Full-time|Part-time|Self-employed|Contract|Freelance|Internship|Apprenticeship|Seasonal)$/i
    const ARRANGEMENT_RE = /^(Hybrid|Remote|On-site|On site)$/i

    for (const { spans, logoUrl, mediaLinks } of rawEntries) {
      if (spans.length < 3) {
        continue
      }

      // Grouped: line[0]=company, line[1]=total duration (e.g. "2 yrs"), then repeating role blocks
      if (DURATION_ONLY_RE.test(spans[1])) {
        const companyName = spans[0]
        // Find where role blocks start (skip company, duration, optional arrangement)
        let start = 2
        if (ARRANGEMENT_RE.test(spans[start])) {
          start++
        }

        // Each role block: [title, (type?), dateRange, location, (summary?), (skills?)]
        let i = start
        while (i < spans.length) {
          const position = spans[i++]
          // Skip employment type if present
          if (i < spans.length && WORK_TYPE_RE.test(spans[i])) {
            i++
          }
          const dateStr = i < spans.length ? spans[i++] : ''
          const location = i < spans.length && !spans[i]?.startsWith('Skills:') ? spans[i++] : ''
          // Collect summary/description lines until Skills: or next role block
          const contentLines: string[] = []
          while (i < spans.length && !spans[i]?.startsWith('Skills:') && !isNextRoleTitle(spans, i)) {
            contentLines.push(spans[i++])
          }
          const skillsStr = i < spans.length && spans[i]?.startsWith('Skills:') ? spans[i++] : ''

          experiences.push(
            buildEntry(position, companyName, dateStr, location, contentLines, skillsStr, logoUrl, mediaLinks)
          )
        }
      } else {
        // Single-role: [position, company · type, dateRange, location · arrangement, summary?, skills?]
        const position = spans[0]
        const companyRaw = spans[1] ?? ''
        const companyName = companyRaw
          .replace(
            /\s*·\s*(Self-employed|Full-time|Part-time|Contract|Freelance|Internship|Apprenticeship|Seasonal)$/i,
            ''
          )
          .trim()
        const dateStr = spans[2] ?? ''
        const location = spans[3] ?? ''
        const contentLines: string[] = []
        let skillsStr = ''
        for (let i = 4; i < spans.length; i++) {
          if (spans[i]?.startsWith('Skills:')) {
            skillsStr = spans[i]
          } else {
            contentLines.push(spans[i])
          }
        }
        experiences.push(
          buildEntry(position, companyName, dateStr, location, contentLines, skillsStr, logoUrl, mediaLinks)
        )
      }
    }

    function isNextRoleTitle(spans: string[], idx: number): boolean {
      // A role title is followed by either a work type or a date range
      if (idx + 1 >= spans.length) {
        return false
      }
      return WORK_TYPE_RE.test(spans[idx + 1]) || DATE_RANGE_RE.test(spans[idx + 1])
    }

    function buildEntry(
      position: string,
      name: string,
      dateStr: string,
      locationRaw: string,
      contentLines: string[],
      skillsStr: string,
      logoUrl: string,
      mediaLinks: { title: string; url: string }[]
    ): ResumeWork {
      const location = locationRaw.replace(/\s*·\s*(Hybrid|Remote|On-site|On site)$/i, '').trim()

      // Parse date range: "Mon YYYY - Mon YYYY · X yrs Y mos"
      const timeInfoParts = dateStr.split(/\s*·\s*/g).map((s) => {
        return s.trim()
      })
      const datePart = timeInfoParts[0] ?? ''
      const dateMatch = datePart.split(/\s*-\s*/g)
      const startDate = parseDate(dateMatch[0]?.trim())
      const rawEnd = dateMatch[1]?.trim() ?? ''
      const endDate = rawEnd === 'Present' ? '' : parseDate(rawEnd)
      const duration = timeInfoParts[1]

      // Skills
      const skills =
        skillsStr
          ?.replace(/^Skills:\s*/, '')
          .split(' · ')
          .map((s) => {
            return s.trim()
          })
          .filter(Boolean) ?? []
      if (!skillsStr) {
        skills.length = 0
      }

      // Summary / highlights
      const filtered = contentLines.filter((l) => {
        return !ARRANGEMENT_RE.test(l)
      })
      const fullText = filtered.join('\n')

      let summary: string
      let highlights: string[] = []

      if (fullText.includes('\n\n')) {
        // Multi-paragraph: keep full text as summary to preserve structure
        summary = fullText.trim()
      } else {
        // Single paragraph: split into summary + bullet highlights
        const startsWithSummary = filtered.length > 0 && !fullText.trimStart().startsWith('-')
        const parts = fullText
          .split(/(?:^|\n)\s*-\s*/)
          .map((s) => {
            return s.trim()
          })
          .filter(Boolean)
        summary = startsWithSummary ? (parts.shift() ?? '') : ''
        highlights = parts
      }

      return {
        name,
        location,
        position,
        startDate,
        endDate,
        duration,
        summary,
        highlights,
        skills,
        mediaLinks,
        logoUrl,
      }
    }
  } catch (e) {
    onScrapeError(e, 'experience', options, logger)
  } finally {
    await scrapeOutputJson(experiences, 'experience', logger, options)
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
