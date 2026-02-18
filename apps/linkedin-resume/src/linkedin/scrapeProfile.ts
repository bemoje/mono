import type { Browser } from 'puppeteer'
import fs from 'fs-extra'
import { join } from 'path/posix'
import { autoScroll } from './utils/autoScroll'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { CliOptions } from '../types/CliOptions'
import { getLinkedInUsername } from './utils/getLinkedInUsername'
import { DIST_PATH } from '../constants'

export async function scrapeProfile(browser: Browser, options: CliOptions): Promise<void> {
  const page = await browser.newPage()

  try {
    const username = await getLinkedInUsername()
    await page.goto(`https://www.linkedin.com/in/${username}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    // Wait for the profile top card to load
    await page.waitForSelector('h1', { timeout: 15000 })

    ////////////////////////////
    ////////////////////////////

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

    if (options.debug) {
      // Dump page text for diagnostics
      const debugDump = await page.evaluate(() => {
        const result: Record<string, unknown> = {}

        // All h1 text
        result.h1s = Array.from(document.querySelectorAll('h1')).map((el) => el.textContent!.trim())

        // Top card area
        const topCard =
          document.querySelector('.pv-top-card') ||
          document.querySelector('[data-view-name="profile-card"]') ||
          document.querySelector('main section:first-of-type')
        if (topCard) {
          result.topCardSpans = Array.from(topCard.querySelectorAll('span'))
            .map((s) => s.textContent!.trim())
            .filter(Boolean)
            .slice(0, 30)
          result.topCardDivText = Array.from(topCard.querySelectorAll('div'))
            .map((d) => d.textContent!.trim())
            .filter((t) => t.length > 2 && t.length < 100)
            .slice(0, 20)
        }

        // All sections with ids
        result.sectionIds = Array.from(document.querySelectorAll('section [id]')).map((el) => el.id)

        // Contact info link
        const contactLinks = Array.from(document.querySelectorAll('a')).filter(
          (a) => a.href.includes('contact-info') || a.textContent!.toLowerCase().includes('contact'),
        )
        result.contactLinks = contactLinks.map((a) => ({ href: a.href, text: a.textContent!.trim() }))

        return result
      })
      const debugPath = join('.temp', 'personal-raw-debug.json')
      await fs.outputFile(debugPath, JSON.stringify(debugDump, null, 2))
      console.log(`Wrote debug dump to ${debugPath}`)
    }

    // Scrape profile top card
    const profile = await page.evaluate(() => {
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

      const skills =
        split[1]
          ?.trim()
          .split('•')
          .map((s) => s.trim())
          .filter(Boolean) ?? []

      // --- Scrape languages section ---
      const languages: { language: string; fluency: string }[] = []

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

      if (!container) return { name, headline, location, image, summary, skills, languages }

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

      return { name, headline, location, image, summary, skills, languages }
    })

    // --- Contact info: click to open the overlay modal ---

    const { email, phone, websites } = await (async () => {
      let email = ''
      let phone = ''
      let websites: string[] = []

      try {
        // Click the contact info link
        const clicked = await page.evaluate(() => {
          const link = document.querySelector('a[href*="/overlay/contact-info/"]')
          if (link) {
            ;(link as HTMLElement).click()
            return true
          }
          // Fallback: look for "Contact info" text link
          const allLinks = Array.from(document.querySelectorAll('a'))
          const contactLink = allLinks.find((a) => /contact\s*info/i.test(a.textContent!))
          if (contactLink) {
            contactLink.click()
            return true
          }
          return false
        })

        if (clicked) {
          // Wait for the modal to appear
          await page
            .waitForSelector('[class*="contact-info"]', { timeout: 5000 })
            .catch(() => page.waitForSelector('.artdeco-modal', { timeout: 3000 }))
            .catch(() => page.waitForSelector('.pv-contact-info', { timeout: 3000 }))

          await new Promise((r) => setTimeout(r, 1000))

          const contactInfo = await page.evaluate(() => {
            const info: { email: string; phone: string; websites: string[]; debug: string[] } = {
              email: '',
              phone: '',
              websites: [],
              debug: [],
            }

            // Try structured sections
            const sections = document.querySelectorAll(
              '.pv-contact-info__contact-type, .ci-email, .ci-phone, .ci-vanity-url, [class*="contact-info"] section',
            )

            for (const section of sections) {
              const text = section.textContent!.trim()
              info.debug.push(text.slice(0, 120))

              const links = Array.from(section.querySelectorAll('a'))
              const mailLink = links.find((a) => a.href?.startsWith('mailto:'))
              if (mailLink) {
                info.email = mailLink.href.replace('mailto:', '')
                continue
              }

              // Email by content
              const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/)
              if (emailMatch && !info.email) {
                info.email = emailMatch[0]
                continue
              }

              // Phone by content
              const phoneMatch = text.match(/(\+?\d[\d\s()-]{6,}\d)/)
              if (phoneMatch && !info.phone) {
                info.phone = phoneMatch[1].trim()
                continue
              }

              // Websites
              for (const link of links) {
                if (link.href && !link.href.includes('linkedin.com') && !link.href.startsWith('mailto:')) {
                  info.websites.push(link.href)
                }
              }
            }

            // Fallback: scan entire modal for email/phone if not found
            if (!info.email || !info.phone) {
              const modal =
                document.querySelector('.pv-contact-info') ||
                document.querySelector('.artdeco-modal') ||
                document.querySelector('[class*="contact-info"]')
              if (modal) {
                const modalText = modal.textContent!
                if (!info.email) {
                  const m = modalText.match(/[\w.+-]+@[\w.-]+\.\w{2,}/)
                  if (m) info.email = m[0]
                }
                if (!info.phone) {
                  const m = modalText.match(/(\+?\d[\d\s()-]{6,}\d)/)
                  if (m) info.phone = m[1].trim()
                }
                // Also dump modal text for debugging
                info.debug.push('MODAL_FULL: ' + modalText.replace(/\s+/g, ' ').slice(0, 500))
              }
            }

            return info
          })

          if (options.debug) {
            const contactDebugPath = join('.temp', 'contact-debug.json')

            await fs.outputFile(contactDebugPath, JSON.stringify(contactInfo, null, 2))
            console.log(`Wrote contact debug to ${contactDebugPath}`)
          }

          email = contactInfo.email
          phone = contactInfo.phone
          websites = contactInfo.websites
        } else {
          console.warn('  ✗ Could not find contact info link to click')
        }
      } catch (err) {
        console.warn(`  ✗ Contact info extraction failed: ${(err as Error).message}`)
      }
      return { email, phone, websites }
    })()

    const result = {
      image: profile.image,
      name: profile.name,
      label: profile.headline,
      location: profile.location,
      email,
      phone,
      websites,
      profiles: [] as { network: string; username: string; url: string }[],
      summary: profile.summary,
      languages: profile.languages,
      skills: profile.skills,
    }

    const dataOutputPath = join(DIST_PATH, 'profile-scraped.json')
    await fs.outputFile(dataOutputPath, JSON.stringify(result, null, 2))
    console.log(`Wrote profile to ${dataOutputPath}`)
  } finally {
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
