import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { parseDate } from './utils/parseDate'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { DIST_PATH } from '../constants'
import { CliOptions } from '../types/CliOptions'

interface WorkEntry {
  name: string
  location: string
  position: string
  startDate: string
  endDate: string
  duration: string | undefined
  summary: string
  highlights: string[]
  skills: string[]
  logoUrl: string
}

export async function scrapeExperience(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}/details/experience`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    // Wait for the experience list to appear
    await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 60000 })

    // Scroll to load all lazy-loaded entries
    await autoScroll(page)
    await patchEsbuildHelpers(page)

    // Extract visible spans from each top-level experience entry
    const rawEntries = await page.evaluate(() => {
      const container = document.querySelector('.scaffold-finite-scroll__content')
      if (!container) return []
      const topLevelItems = Array.from(container.querySelector('ul')?.children ?? [])

      const getTextWithBreaks = (el: Element): string => {
        let text = ''
        for (const node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent
          } else if (node.nodeName === 'BR') {
            text += '\n'
          } else {
            text += getTextWithBreaks(node as Element)
          }
        }
        return text.trim()
      }

      const getVisibleSpans = (el: Element): string[] => {
        return Array.from(el.querySelectorAll('span'))
          .filter((span) => !span.className.includes('visually-hidden') && span.hasAttribute('aria-hidden'))
          .map((span) => getTextWithBreaks(span))
      }

      return topLevelItems.map((li) => ({
        spans: getVisibleSpans(li),
        logoUrl: li.querySelector('img')?.src ?? '',
      }))
    })

    // Detect whether entry is grouped (multi-role) or single-role, then parse
    const DATE_RANGE_RE = /^[A-Z][a-z]{2}\s+\d{4}\s*-\s*([A-Z][a-z]{2}\s+\d{4}|Present)\s*·/
    const DURATION_ONLY_RE = /^\d+\s*(yrs?|mos?)\b/
    const WORK_TYPE_RE =
      /^(Full-time|Part-time|Self-employed|Contract|Freelance|Internship|Apprenticeship|Seasonal)$/i
    const ARRANGEMENT_RE = /^(Hybrid|Remote|On-site|On site)$/i

    const experiences: WorkEntry[] = []

    for (const { spans, logoUrl } of rawEntries) {
      if (spans.length < 3) continue

      // Grouped: line[0]=company, line[1]=total duration (e.g. "2 yrs"), then repeating role blocks
      if (DURATION_ONLY_RE.test(spans[1])) {
        const companyName = spans[0]
        // Find where role blocks start (skip company, duration, optional arrangement)
        let start = 2
        if (ARRANGEMENT_RE.test(spans[start])) start++

        // Each role block: [title, (type?), dateRange, location, (summary?), (skills?)]
        let i = start
        while (i < spans.length) {
          const position = spans[i++]
          // Skip employment type if present
          if (i < spans.length && WORK_TYPE_RE.test(spans[i])) i++
          const dateStr = i < spans.length ? spans[i++] : ''
          const location = i < spans.length && !spans[i]?.startsWith('Skills:') ? spans[i++] : ''
          // Collect summary/description lines until Skills: or next role block
          const contentLines: string[] = []
          while (i < spans.length && !spans[i]?.startsWith('Skills:') && !isNextRoleTitle(spans, i)) {
            contentLines.push(spans[i++])
          }
          const skillsStr = i < spans.length && spans[i]?.startsWith('Skills:') ? spans[i++] : ''

          experiences.push(buildEntry(position, companyName, dateStr, location, contentLines, skillsStr, logoUrl))
        }
      } else {
        // Single-role: [position, company · type, dateRange, location · arrangement, summary?, skills?]
        const position = spans[0]
        const companyRaw = spans[1] ?? ''
        const companyName = companyRaw
          .replace(
            /\s*·\s*(Self-employed|Full-time|Part-time|Contract|Freelance|Internship|Apprenticeship|Seasonal)$/i,
            '',
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
        experiences.push(buildEntry(position, companyName, dateStr, location, contentLines, skillsStr, logoUrl))
      }
    }

    function isNextRoleTitle(spans: string[], idx: number): boolean {
      // A role title is followed by either a work type or a date range
      if (idx + 1 >= spans.length) return false
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
    ): WorkEntry {
      const location = locationRaw.replace(/\s*·\s*(Hybrid|Remote|On-site|On site)$/i, '').trim()

      // Parse date range: "Mon YYYY - Mon YYYY · X yrs Y mos"
      const timeInfoParts = dateStr.split(/\s*·\s*/g).map((s) => s.trim())
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
          .map((s) => s.trim())
          .filter(Boolean) ?? []
      if (!skillsStr) skills.length = 0

      // Summary / highlights
      const filtered = contentLines.filter((l) => !ARRANGEMENT_RE.test(l))
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
          .map((s) => s.trim())
          .filter(Boolean)
        summary = startsWithSummary ? (parts.shift() ?? '') : ''
        highlights = parts
      }

      return { name, location, position, startDate, endDate, duration, summary, highlights, skills, logoUrl }
    }

    // Write output
    const outPath = join(DIST_PATH, 'work-scraped.json')
    await fs.outputFile(outPath, JSON.stringify(experiences, null, 2))
    console.log(`Wrote ${experiences.length} experiences to ${outPath}`)
  } finally {
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
