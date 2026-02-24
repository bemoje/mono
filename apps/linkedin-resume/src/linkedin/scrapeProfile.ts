import type { Browser } from 'puppeteer'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { CliOptions } from '../types/CliOptions'
import { ResumeLanguage } from "../types/Resume";
import { ResumeProfile } from "../types/Resume";
import { onScrapeError } from './utils/onScrapeError'
import { scrapeOutputJson } from './utils/scrapeOutputJson'
import { userConfigFile } from '../userConfigFile'
import { getPageUrl } from './utils/getPageUrl'
import { Logger } from '@mono/node'

export async function scrapeProfile(browser: Browser, options: CliOptions, logger: Logger): Promise<void> {
  const config = userConfigFile.load()
  const username = config.username

  const languages: ResumeLanguage[] = []
  const profileData = {
    social: [
      {
        network: 'LinkedIn',
        username,
        url: getPageUrl(username, 'profile'),
      },
      ...(config.social ?? []),
    ],
  } as ResumeProfile

  const page = await browser.newPage()

  try {
    await page.goto(getPageUrl(username, 'profile'), {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    // Wait for the profile top card to load
    await page.waitForSelector('h1', { timeout: 15000 })

    // Expand all "...see more" buttons so truncated sections (About, etc.) are fully visible
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'))
      for (const btn of buttons) {
        const text = btn.textContent!.trim().toLowerCase()
        if (text === '…see more' || text === 'see more' || text === '...see more') {
          ;(btn as HTMLElement).click()
        }
      }
    })
    await new Promise((r) => setTimeout(r, 250))

    await autoScroll(page)
    await patchEsbuildHelpers(page)
    await injectBrowserHelpers(page)

    // Scrape profile top card
    const scraped = await page.evaluate(() => {
      // Name
      const name = document.querySelector('h1')?.textContent?.trim() ?? ''

      // Headline - try multiple selectors
      const headline =
        document.querySelector('.text-body-medium')?.textContent?.trim() ||
        document.querySelector('[data-generated-suggestion-target]')?.textContent?.trim() ||
        ''

      // Location - try multiple selectors
      const locationEl =
        document.querySelector('.text-body-small.inline.t-black--light.break-words') ||
        document.querySelector('.pv-text-details__left-panel .text-body-small') ||
        document.querySelector('.text-body-small[class*="break-words"]')

      // Parse location string: "Herning, Midtjylland, Denmark" → { city, region, countryCode }
      const locParts = (locationEl?.textContent?.trim() ?? '').split(/\s*,\s*/).map((s) => s.trim())
      const location = {
        city: locParts[0] ?? '',
        region: locParts[1] ?? '',
        countryCode: locParts[2] ?? '',
      }

      // Profile photo
      const imgEl =
        document.querySelector('.pv-top-card-profile-picture__image--show') ||
        document.querySelector('.pv-top-card-profile-picture__image') ||
        document.querySelector('img.profile-photo-edit__preview') ||
        document.querySelector('img[class*="profile"][width="200"]') ||
        document.querySelector('main img[src*="profile"]')
      const image = (imgEl as HTMLImageElement | null)?.src ?? ''

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getTextWithBreaks = (globalThis as any).__getTextWithBreaks as (el: Element) => string

      // About section - try id anchor then look for the section heading
      let summary = ''
      const aboutAnchor = document.querySelector('#about')
      if (aboutAnchor) {
        const container = aboutAnchor.closest('section')
        if (container) {
          const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'))
          summary = spans.map((s) => getTextWithBreaks(s).trim()).join('\n\n')
        }
      }
      if (!summary) {
        // Fallback: find section whose heading says "About"
        for (const section of document.querySelectorAll('section')) {
          const heading = section.querySelector('h2, [class*="title"]')
          if (heading && /^about$/i.test(heading.textContent!.trim())) {
            const spans = Array.from(section.querySelectorAll('span[aria-hidden="true"]'))
            summary = spans.map((s) => getTextWithBreaks(s).trim()).join('\n\n')
          }
        }
      }
      summary = summary.replace(/^About\n/, '').trim()

      const split = summary.split(/\s+top skills\s/i)
      summary = (split[0]?.trim() || '').replace(/\n{3,}/g, '\n\n')

      const topSkills =
        split[1]
          ?.trim()
          .split('•')
          .map((s) => s.trim())
          .filter(Boolean) ?? []

      // --- Scrape languages section ---
      const languages: ResumeLanguage[] = []

      // Try #languages anchor first
      const anchor = document.querySelector('#languages')
      let container = anchor?.closest('section') ?? null

      // Fallback: find section whose heading says "Languages"
      if (!container) {
        for (const section of document.querySelectorAll('section')) {
          const heading = section.querySelector('h2, [class*="title"]')
          if (heading && /^languages$/i.test(heading.textContent!.trim())) {
            container = section
            break
          }
        }
      }

      if (container) {
        // Each language is in a list item with visible spans
        const items = container.querySelectorAll('li')
        for (const li of items) {
          const spans = Array.from(li.querySelectorAll('span[aria-hidden="true"]'))
            .map((s) => s.textContent!.trim())
            .filter(Boolean)
          if (spans.length >= 1) {
            languages.push({
              language: spans[0],
              fluency: spans[1] ?? '',
            })
          }
        }
      }

      return { profile: { name, headline, location, image, summary, topSkills }, languages }
    })

    languages.push(...scraped.languages)

    profileData.name = scraped.profile.name
    profileData.headline = scraped.profile.headline
    profileData.image = scraped.profile.image
    profileData.location = scraped.profile.location
    profileData.summary = scraped.profile.summary
    profileData.topSkills = scraped.profile.topSkills

    // --- Contact info: click to open the overlay modal ---
    await page.evaluate(() => {
      const link = document.querySelector('a[href*="/overlay/contact-info/"]') as HTMLElement | undefined
      if (link) {
        return link.click?.()
      }
      // Fallback: look for "Contact info" text link
      Array.from(document.querySelectorAll('a'))
        .filter((a) => /contact\s*info/i.test(a.textContent!))
        .forEach((el) => el.click?.())
    })

    // Wait for the modal to appear
    await page
      .waitForSelector('[class*="contact-info"]', { timeout: 5000 })
      .catch(() => page.waitForSelector('.artdeco-modal', { timeout: 3000 }))
      .catch(() => page.waitForSelector('.pv-contact-info', { timeout: 3000 }))

    await new Promise((r) => setTimeout(r, 1500))

    const contactInfo = await page.evaluate(() => {
      const data = {
        email: '',
        phone: '',
        websites: [] as string[],
      }

      // Try structured sections
      const sections = document.querySelectorAll(
        '.pv-contact-info__contact-type, .ci-email, .ci-phone, .ci-vanity-url, [class*="contact-info"] section',
      )

      for (const section of sections) {
        const text = section.textContent!.trim()

        const links = Array.from(section.querySelectorAll('a'))
        const mailLink = links.find((a) => a.href?.startsWith('mailto:'))
        if (mailLink) {
          data.email = mailLink.href.replace('mailto:', '')
          continue
        }

        // Email by content
        const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/)
        if (emailMatch && !data.email) {
          data.email = emailMatch[0]
          continue
        }

        // Phone by content
        const phoneMatch = text.match(/(\+?\d[\d\s()-]{6,}\d)/)
        if (phoneMatch && !data.phone) {
          data.phone = phoneMatch[1].trim()
          continue
        }

        // Websites
        for (const link of links) {
          if (link.href && !link.href.includes('linkedin.com') && !link.href.startsWith('mailto:')) {
            data.websites.push(link.href)
          }
        }
      }

      // Fallback: scan entire modal for email/phone if not found
      if (!data.email || !data.phone) {
        const modal =
          document.querySelector('.pv-contact-info') ||
          document.querySelector('.artdeco-modal') ||
          document.querySelector('[class*="contact-info"]')
        if (modal) {
          const modalText = modal.textContent!
          if (!data.email) {
            const m = modalText.match(/[\w.+-]+@[\w.-]+\.\w{2,}/)
            if (m) data.email = m[0]
          }
          if (!data.phone) {
            const m = modalText.match(/(\+?\d[\d\s()-]{6,}\d)/)
            if (m) data.phone = m[1].trim()
          }
        }
      }

      return data
    })

    profileData.email = contactInfo.email
    profileData.phone = contactInfo.phone
    profileData.websites = contactInfo.websites
  } catch (e) {
    onScrapeError(e, 'profile', options, logger)
  } finally {
    await scrapeOutputJson(profileData, 'profile', logger, options)
    await scrapeOutputJson(languages, 'languages', logger, options)
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
