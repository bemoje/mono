import type { Article } from './types'
import { DR_DK_NYHEDER_URL } from './cheerio'
import type { Page } from 'playwright'
import { chromium } from 'playwright'
import db from '../db'
import { forEachAsync } from 'es-toolkit'

export function parseTime(t: string) {
  const date = new Date()
  if (t.includes('min. siden')) {
    const mins = t.split(' ')[0]
    date.setMinutes(date.getMinutes() - Number(mins))
  } else {
    const [d, hhmm] = t.split(' kl. ')
    const [hh, mm] = hhmm.split(':').map(Number)
    date.setHours(hh, mm, 0, 0)
    if (d === 'I går') {
      date.setDate(date.getDate() - 1)
    }
  }
  return date
}

async function scrapeArticle(page: Page, url: string) {
  try {
    console.log(`Navigerer til artikel: ${url}`)
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    })

    await page.waitForSelector('article', { timeout: 30_000 })

    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('article div.dre-speech')).map((el) => {
        return el.textContent?.trim() ?? ''
      })
    })
  } catch (error) {
    console.error('Fejl ved scraping af artikel:', error)
  }
}

export async function scrapeDR() {
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()

    console.log('Navigerer til dr.dk/nyheder...')
    await page.goto(DR_DK_NYHEDER_URL, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    })

    await page.waitForSelector('li.hydra-latest-news-page__short-news-item', { timeout: 15_000 })

    const articles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('li.hydra-latest-news-page__short-news-item')).map((li) => {
        const article = li.querySelector('article')
        if (article) {
          const metaLabels = Array.from(article.querySelectorAll('span.dre-teaser-meta-label')).map((el) => {
            return el.textContent?.trim() ?? ''
          })
          const [category, time] = metaLabels
          return {
            type: 'article',
            url:
              article
                .querySelector(
                  'div.hydra-latest-news-page-short-news-article__share div.dre-share-link-copy-url__copy-link-hidden'
                )
                ?.innerHTML?.trim() ?? undefined,
            time,
            category,
            heading: article
              .querySelector('div.hydra-latest-news-page-short-news-article__heading')
              ?.textContent?.trim(),
            body: (
              article.querySelector(
                'div.hydra-latest-news-page-short-news-article__body > div.hydra-latest-news-page-short-news-article__body'
              ) as HTMLElement
            )?.innerText?.trim(),
          }
        }

        const card = li.querySelector('div.hydra-latest-news-page-short-news-card')
        if (card) {
          const metaLabels = Array.from(
            li
              .querySelector('div.hydra-latest-news-page-short-news-card__meta')
              ?.querySelectorAll('span.dre-teaser-meta-label') ?? []
          ).map((el) => {
            return el.textContent?.trim() ?? ''
          })
          const [category, time] = metaLabels
          return {
            type: 'card',
            url:
              (li.querySelector('div.hydra-latest-news-page-short-news-card__title a') as HTMLAnchorElement | null)
                ?.href ?? undefined,
            time,
            category,
            heading: li.querySelector('div.hydra-latest-news-page-short-news-card__title')?.textContent?.trim(),
            body:
              li.querySelector('p.hydra-latest-news-page-short-news-card__summary')?.innerHTML?.trim() ??
              undefined,
          }
        }
        return null
      })
    })

    const filtered = articles
      .filter((o) => {
        return (
          !!o &&
          !!o.heading &&
          !!o.body &&
          !!o.time &&
          !!o.category &&
          !!o.url &&
          !o.url.includes('dr.dk/sporten/')
        )
      })
      .map((o) => {
        const cachedRow = db.prepare(`SELECT heading, summary FROM articles WHERE url = ?`).get(o!.url!) as any

        return {
          ...(cachedRow ? { ...o, heading: cachedRow.heading || o!.heading, summary: cachedRow.summary } : o),
          type: o!.url!.startsWith('https://www.dr.dk/nyheder/seneste/') ? 'card' : 'article',
          time: o!.time!,
          body: o!
            .body!.split(/\n+/g)
            .map((line) => {
              return line.trim()
            })
            .filter((line) => {
              return !!line
            }),
        } as Article
      })

    filtered.forEach((article) => {
      db.prepare(
        `
        INSERT INTO articles (url, type, time, category, heading, summary)
        VALUES (@url, @type, @time, @category, @heading, @summary)
        ON CONFLICT(url) DO NOTHING
      `
      ).run({
        ...article,
        time: parseTime(article.time).getTime(),
        summary: article.summary ?? null,
      })
    })

    await forEachAsync(
      filtered,
      async (article) => {
        if (article.type === 'article') {
          try {
            const cachedRow = db
              .prepare(`SELECT summary FROM articles WHERE url = ? AND summary IS NOT NULL`)
              .get(article.url) as any
            if (cachedRow && cachedRow.summary) return
            const newBody = (await scrapeArticle(await browser.newPage(), article.url)) ?? []
            article.body = newBody
          } catch (error) {
            console.error('Fejl ved scraping af artikel:', error)
          }
        }
      },
      { concurrency: 5 }
    )

    return filtered
  } finally {
    await browser.close()
  }
}
