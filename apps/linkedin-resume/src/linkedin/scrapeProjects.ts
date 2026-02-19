import type { Browser } from 'puppeteer'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { CliOptions } from '../types/CliOptions'
import { parseDate } from './utils/parseDate'
import { onScrapeError } from './utils/onScrapeError'
import { scrapeOutputJson } from './utils/scrapeOutputJson'
import { userConfigFile } from '../userConfigFile'
import { ResumeProject } from '../types/Resume'
import { getPageUrl } from './utils/getPageUrl'
import { Logger } from '@mono/node'

export async function scrapeProjects(browser: Browser, options: CliOptions, logger: Logger): Promise<void> {
  const page = await browser.newPage()

  const projects: ResumeProject[] = []

  try {
    const username = userConfigFile.load().username
    await page.goto(getPageUrl(username, 'projects'), {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch {
      logger.warn('No projects section found or it took too long to load.')
      throw 'ignore'
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
    onScrapeError(e, 'projects', options, logger)
  } finally {
    await scrapeOutputJson(projects, 'projects', logger, options)
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
