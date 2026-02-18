import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { CliOptions } from '../types/CliOptions'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { DIST_PATH } from '../constants'

interface SkillEntry {
  name: string
  associations: string[]
}

export async function scrapeSkills(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}/details/skills`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 60000 })
    await autoScroll(page)
    await patchEsbuildHelpers(page)
    await injectBrowserHelpers(page)

    const rawEntries = await page.evaluate(() => {
      const container = document.querySelector('.scaffold-finite-scroll__content')
      if (!container) return []
      const topLevelItems = Array.from(container.querySelector('ul')?.children ?? [])

      const getVisibleSpans = (globalThis as any).__getVisibleSpans as (el: Element) => string[]

      return topLevelItems.map((li) => ({
        spans: getVisibleSpans(li),
        logoUrl: li.querySelector('img')?.src ?? '',
      }))
    })

    if (options.debug) {
      const debugPath = join('.temp', 'skills-raw-debug.json')
      await fs.outputFile(debugPath, JSON.stringify(rawEntries, null, 2))
      console.log(`Wrote raw skill spans to ${debugPath}`)
    }

    // Each skill entry typically has spans:
    // [0] = skill name
    // [1..] = endorsement info, associated experiences, etc.
    const skills: SkillEntry[] = []

    for (const { spans } of rawEntries) {
      if (spans.length < 1) continue

      const name = spans[0]
      if (!name) continue

      const associations = spans.slice(1).filter((s) => s !== name)

      skills.push({ name, associations })
    }

    const outPath = join(DIST_PATH, 'skills-scraped.json')
    await fs.outputFile(outPath, JSON.stringify(skills, null, 2))
    console.log(`Wrote ${skills.length} skills to ${outPath}`)
  } finally {
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
