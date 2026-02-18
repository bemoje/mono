import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { CliOptions } from '../types/CliOptions'
import { DIST_PATH } from '../constants'

export async function scrapeEducation(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}/details/education`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 60000 })
    await autoScroll(page)
    await patchEsbuildHelpers(page)

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

    // Date pattern: "2022 - 2024" or "Sep 2022 - Oct 2024" or just "2022"
    const EDU_DATE_RE =
      /^\d{4}$|^[A-Z][a-z]{2}\s+\d{4}$|^\d{4}\s*-\s*\d{4}$|^[A-Z][a-z]{2}\s+\d{4}\s*-\s*[A-Z][a-z]{2}\s+\d{4}$/

    const entries: {
      institution: string
      area: string
      studyType: string
      startDate: string
      endDate: string
      score: string
      courses: string[]
      skills: string[]
      logoUrl: string
    }[] = []

    for (const { spans, logoUrl } of rawEntries) {
      if (spans.length < 2) continue

      const institution = spans[0]
      let area = ''
      let dateStr = ''
      let idx = 1

      // Line 1 could be degree/area or date range
      if (EDU_DATE_RE.test(spans[idx])) {
        dateStr = spans[idx++]
      } else {
        area = spans[idx++]
        // Line 2 should be dates
        if (idx < spans.length && EDU_DATE_RE.test(spans[idx])) {
          dateStr = spans[idx++]
        }
      }

      // Remaining lines: could be grade, activities, description, skills
      const contentLines: string[] = []
      let skillsStr = ''
      while (idx < spans.length) {
        if (spans[idx]?.startsWith('Skills:')) {
          skillsStr = spans[idx++]
        } else {
          contentLines.push(spans[idx++])
        }
      }

      // Parse dates
      function parseEducationDate(d: string): string {
        if (!d) return ''
        // Year only: "2022" → "2022-01-01"
        if (/^\d{4}$/.test(d)) return `${d}-01-01`
        // Month + year: "Sep 2022" → parse to "2022-09-01"
        try {
          const date = new Date(Date.parse('2 ' + d))
          return date.toISOString().slice(0, 7) + '-01'
        } catch {
          return d
        }
      }

      const dateParts = dateStr.split(/\s*-\s*/)
      const startDate = parseEducationDate(dateParts[0]?.trim())
      const endDate = parseEducationDate(dateParts[1]?.trim())

      // Skills
      const skills = skillsStr
        ? skillsStr
            .replace(/^Skills:\s*/, '')
            .split(' · ')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      // Extract courses from "Completed Courses:" lines, rest goes to studyType
      const courses: string[] = []
      const otherLines: string[] = []
      for (const line of contentLines) {
        if (line.startsWith('Completed Courses:')) {
          const courseStr = line.replace(/^Completed Courses:\s*/, '').replace(/\.$/, '')
          courses.push(...courseStr.split(/\s*,\s*/).filter(Boolean))
        } else {
          otherLines.push(line)
        }
      }

      const studyType = otherLines.join('\n').trim()

      entries.push({
        institution,
        area,
        studyType,
        startDate,
        endDate,
        score: '',
        courses,
        skills,
        logoUrl,
      })
    }

    const outPath = join(DIST_PATH, 'education-scraped.json')
    await fs.outputFile(outPath, JSON.stringify(entries, null, 2))
    console.log(`Wrote ${entries.length} education entries to ${outPath}`)
  } finally {
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
