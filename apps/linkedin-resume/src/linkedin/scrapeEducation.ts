import { toError } from '@mono/node'
import { prettyStackTrace } from '@mono/stacktrace'
import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { parseDate } from './utils/parseDate'
import { CliOptions } from '../types/CliOptions'
import { DIST_PATH } from '../constants'

export async function scrapeEducation(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  const entries: {
    institution: string
    area: string
    studyType: string
    startDate: string
    endDate: string
    score: string
    courses: string[]
    skills: string[]
    mediaLinks: { title: string; url: string }[]
    logoUrl: string
  }[] = []

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}/details/education/?locale=en_US`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch {
      console.warn('No education section found or it took too long to load.')
    }
    await autoScroll(page)
    await patchEsbuildHelpers(page)
    await injectBrowserHelpers(page)

    const rawEntries = await page.evaluate(() => {
      const container = document.querySelector('.scaffold-finite-scroll__content')
      if (!container) return []
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
        const spans = getVisibleSpans(li).filter((text) => !mediaTextSet.has(text))
        return {
          spans,
          logoUrl: li.querySelector('img')?.src ?? '',
          mediaLinks,
        }
      })
    })

    // Date pattern: "2022 - 2024" or "Sep 2022 - Oct 2024" or just "2022"
    const EDU_DATE_RE =
      /^\d{4}$|^[A-Z][a-z]{2}\s+\d{4}$|^\d{4}\s*-\s*\d{4}$|^[A-Z][a-z]{2}\s+\d{4}\s*-\s*[A-Z][a-z]{2}\s+\d{4}$/

    for (const { spans, logoUrl, mediaLinks } of rawEntries) {
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

      // Parse dates - education dates append day precision
      function parseEducationDate(d: string): string {
        if (!d) return ''
        if (/^\d{4}$/.test(d)) return `${d}-01`
        const parsed = parseDate(d)
        return parsed && parsed !== d ? parsed : d
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
        mediaLinks,
        logoUrl,
      })
    }
  } catch (e) {
    const error = toError(e)
    error.message = 'Error scraping education: ' + error.message
    console.error(options.debug ? prettyStackTrace(error) : error.message)
  } finally {
    const outPath = join(DIST_PATH, 'education-scraped.json')
    await fs.outputFile(outPath, JSON.stringify(entries, null, 2))
    console.log(`Wrote ${entries.length} education entries to ${outPath}`)

    if (!options.keepOpen) {
      await page.close()
    }
  }
}
