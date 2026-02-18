import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { CliOptions } from '../types/CliOptions'
import { parseDate } from './utils/parseDate'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { DIST_PATH } from '../constants'
import { prettyStackTrace } from '@mono/stacktrace'
import { toError } from '@mono/node'

interface ProjectEntry {
  name: string
  description: string
  highlights: string[]
  skills: string[]
  startDate: string
  endDate: string
  roles: string[]
  entity: string
  type: string
  url: string
  mediaLinks: { title: string; url: string }[]
  logoUrl: string
}

export async function scrapeProjects(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  const projects: ProjectEntry[] = []

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}/details/projects/?locale=en_US`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch {
      console.warn('No projects section found or it took too long to load.')
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

    if (options.debug) {
      // Dump raw spans for diagnostic on first run
      const debugPath = join('.temp', 'projects-raw-debug.json')

      await fs.outputFile(debugPath, JSON.stringify(rawEntries, null, 2))
      console.log(`Wrote raw project spans to ${debugPath}`)
    }

    // Date patterns for project entries
    const PROJ_DATE_RE = /^[A-Z][a-z]{2}\s+\d{4}\s*-\s*([A-Z][a-z]{2}\s+\d{4}|Present)$|^[A-Z][a-z]{2}\s+\d{4}$/
    const ASSOC_RE = /^Associated with\s+/

    for (const { spans, logoUrl, mediaLinks } of rawEntries) {
      if (spans.length < 2) continue

      const name = spans[0]
      let dateStr = ''
      let entity = ''
      let idx = 1

      // Consume date and "Associated with" in any order
      for (let j = 0; j < 2 && idx < spans.length; j++) {
        if (PROJ_DATE_RE.test(spans[idx])) {
          dateStr = spans[idx++]
        } else if (ASSOC_RE.test(spans[idx])) {
          entity = spans[idx++].replace(ASSOC_RE, '').trim()
        } else {
          break
        }
      }

      // Remaining: description lines and skills
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
      const dateParts = dateStr.split(/\s*-\s*/)
      const startDate = parseDate(dateParts[0]?.trim())
      const rawEnd = dateParts[1]?.trim() ?? ''
      const endDate = rawEnd === 'Present' ? '' : parseDate(rawEnd)

      // Keywords from skills
      const skills = skillsStr
        ? skillsStr
            .replace(/^Skills:\s*/, '')
            .split(' · ')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      // Description / highlights
      const allText = contentLines.filter(Boolean)
      const fullText = allText.join('\n')

      let description: string
      let highlights: string[] = []

      if (fullText.includes('\n\n')) {
        // Multi-paragraph: keep full text as description to preserve structure
        description = fullText.trim()
      } else {
        // Single paragraph: split into description + bullet highlights
        const startsWithDesc = allText.length > 0 && !fullText.trimStart().startsWith('-')
        const parts = fullText
          .split(/(?:^|\n)\s*-\s*/)
          .map((s) => s.trim())
          .filter(Boolean)
        description = startsWithDesc ? (parts.shift() ?? '') : ''
        highlights = parts
      }

      projects.push({
        name,
        description,
        highlights,
        skills,
        startDate,
        endDate,
        roles: [],
        entity,
        type: '',
        url: mediaLinks[0]?.url ?? '',
        mediaLinks,
        logoUrl,
      })
    }
  } catch (e) {
    const error = toError(e)
    error.message = 'Error scraping projects: ' + error.message
    console.error(options.debug ? prettyStackTrace(error) : error.message)
  } finally {
    const outPath = join(DIST_PATH, 'projects-scraped.json')
    await fs.outputFile(outPath, JSON.stringify(projects, null, 2))
    console.log(`Wrote ${projects.length} projects to ${outPath}`)

    if (!options.keepOpen) {
      await page.close()
    }
  }
}
