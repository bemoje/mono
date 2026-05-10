import type { Article } from './types'
import { DR_DK_NYHEDER_URL } from './cheerio'
import type { Page } from 'playwright'
import { and } from 'drizzle-orm'
import { articles as articlesSchema } from '../../common/schema'
import { browserSession } from './withBrowser'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { forEachAsync } from 'es-toolkit'
import { isNotNull } from 'drizzle-orm'

async function scrapeArticle(page: Page, url: string) {
  console.log(`Navigerer til artikel: ${url}`)
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  })

  await page.waitForSelector('article')

  return await page.evaluate(() =>
    Array.from(document.querySelectorAll('article div.dre-speech')).map((el) => el.textContent?.trim() ?? '')
  )
}

export async function scrapeDR() {
  return await browserSession(
    { headless: true },
    async ({ contextSession }) =>
      await contextSession({}, async ({ context, pageSession }) => {
        context.setDefaultTimeout(30000)
        context.setDefaultNavigationTimeout(30000)

        const articles = await pageSession(async (page) => {
          console.log('Navigerer til dr.dk/nyheder...')
          await page.goto(DR_DK_NYHEDER_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 30_000,
          })

          await page.waitForSelector('li.hydra-latest-news-page__short-news-item')

          return await page.evaluate(() =>
            Array.from(document.querySelectorAll('li.hydra-latest-news-page__short-news-item')).map((li) => {
              const article = li.querySelector('article')
              if (article) {
                const metaLabels = Array.from(article.querySelectorAll('span.dre-teaser-meta-label')).map(
                  (el) => el.textContent?.trim() ?? ''
                )
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
                ).map((el) => el.textContent?.trim() ?? '')
                const [category, time] = metaLabels
                return {
                  type: 'card',
                  url:
                    (
                      li.querySelector(
                        'div.hydra-latest-news-page-short-news-card__title a'
                      ) as HTMLAnchorElement | null
                    )?.href ?? undefined,
                  time,
                  category,
                  heading: li
                    .querySelector('div.hydra-latest-news-page-short-news-card__title')
                    ?.textContent?.trim(),
                  body:
                    li.querySelector('p.hydra-latest-news-page-short-news-card__summary')?.innerHTML?.trim() ??
                    undefined,
                }
              }
              return null
            })
          )
        })

        const filteredItems = articles.filter(
          (o) =>
            !!o &&
            !!o.heading &&
            !!o.body &&
            !!o.time &&
            !!o.category &&
            !!o.url &&
            !o.url.includes('dr.dk/sporten/')
        )

        const filtered = await Promise.all(
          filteredItems.map(async (o) => {
            const parsedUrl = new URL(o!.url!)
            const origin = parsedUrl.origin
            const pathname = parsedUrl.pathname
            const rows = await db
              .select({ heading: articlesSchema.heading, summary: articlesSchema.summary })
              .from(articlesSchema)
              .where(and(eq(articlesSchema.origin, origin), eq(articlesSchema.pathname, pathname)))
            const cachedRow = rows[0]

            return {
              ...(cachedRow ? { ...o, heading: cachedRow.heading || o!.heading, summary: cachedRow.summary } : o),
              type: o!.url!.startsWith('https://www.dr.dk/nyheder/seneste/') ? 'card' : 'article',
              time: o!.time!,
              origin,
              pathname,
              url: o!.url!,
              body: o!
                .body!.split(/\n+/g)
                .map((line) => line.trim())
                .filter((line) => !!line),
            } as Article
          })
        )

        await Promise.all(
          filtered.map(async (article) => {
            try {
              await db.insert(articlesSchema).values({
                origin: article.origin,
                pathname: article.pathname,
                time: parseTime(article.time).getTime(),
                heading: article.heading,
                summary: article.summary ?? null,
              })
              // .onConflictDoNothing() // Requires unique constraint, which is currently missing.
            } catch (_e) {
              // Ignore insert errors, might be duplicates
            }
          })
        )

        await forEachAsync(
          filtered,
          async (article) => {
            if (article.type === 'article') {
              try {
                const rows = await db
                  .select({ summary: articlesSchema.summary })
                  .from(articlesSchema)
                  .where(
                    and(
                      eq(articlesSchema.origin, article.origin),
                      eq(articlesSchema.pathname, article.pathname),
                      isNotNull(articlesSchema.summary)
                    )
                  )
                const cachedRow = rows[0]

                if (cachedRow && cachedRow.summary) return

                const newBody = await pageSession(
                  async (page) =>
                    (await scrapeArticle(page, article.url || `${article.origin}${article.pathname}`)) ?? []
                )

                article.body = newBody
              } catch (error) {
                console.error('Fejl ved scraping af artikel:', error)
              }
            }
          },

          { concurrency: 5 }
        )

        return filtered
      })
  )
}

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

//   const browser = await chromium.launch({ headless: true })

//   const context = await browser.newContext()
//   context.setDefaultNavigationTimeout(30_000)
//   context.setDefaultTimeout(30_000)

//   try {
//     const page = await context.newPage()

//     console.log('Navigerer til dr.dk/nyheder...')
//     await page.goto(DR_DK_NYHEDER_URL, {
//       waitUntil: 'domcontentloaded',
//       timeout: 30_000,
//     })

//     await page.waitForSelector('li.hydra-latest-news-page__short-news-item')

//     const articles = await page.evaluate(() => {
//       return Array.from(document.querySelectorAll('li.hydra-latest-news-page__short-news-item')).map((li) => {
//         const article = li.querySelector('article')
//         if (article) {
//           const metaLabels = Array.from(article.querySelectorAll('span.dre-teaser-meta-label')).map((el) => {
//             return el.textContent?.trim() ?? ''
//           })
//           const [category, time] = metaLabels
//           return {
//             type: 'article',
//             url:
//               article
//                 .querySelector(
//                   'div.hydra-latest-news-page-short-news-article__share div.dre-share-link-copy-url__copy-link-hidden'
//                 )
//                 ?.innerHTML?.trim() ?? undefined,
//             time,
//             category,
//             heading: article
//               .querySelector('div.hydra-latest-news-page-short-news-article__heading')
//               ?.textContent?.trim(),
//             body: (
//               article.querySelector(
//                 'div.hydra-latest-news-page-short-news-article__body > div.hydra-latest-news-page-short-news-article__body'
//               ) as HTMLElement
//             )?.innerText?.trim(),
//           }
//         }

//         const card = li.querySelector('div.hydra-latest-news-page-short-news-card')
//         if (card) {
//           const metaLabels = Array.from(
//             li
//               .querySelector('div.hydra-latest-news-page-short-news-card__meta')
//               ?.querySelectorAll('span.dre-teaser-meta-label') ?? []
//           ).map((el) => {
//             return el.textContent?.trim() ?? ''
//           })
//           const [category, time] = metaLabels
//           return {
//             type: 'card',
//             url:
//               (li.querySelector('div.hydra-latest-news-page-short-news-card__title a') as HTMLAnchorElement | null)
//                 ?.href ?? undefined,
//             time,
//             category,
//             heading: li.querySelector('div.hydra-latest-news-page-short-news-card__title')?.textContent?.trim(),
//             body:
//               li.querySelector('p.hydra-latest-news-page-short-news-card__summary')?.innerHTML?.trim() ??
//               undefined,
//           }
//         }
//         return null
//       })
//     })

//     const filtered = articles
//       .filter((o) => {
//         return (
//           !!o &&
//           !!o.heading &&
//           !!o.body &&
//           !!o.time &&
//           !!o.category &&
//           !!o.url &&
//           !o.url.includes('dr.dk/sporten/')
//         )
//       })
//       .map((o) => {
//         const cachedRow = db.prepare(`SELECT heading, summary FROM articles WHERE url = ?`).get(o!.url!) as any

//         return {
//           ...(cachedRow ? { ...o, heading: cachedRow.heading || o!.heading, summary: cachedRow.summary } : o),
//           type: o!.url!.startsWith('https://www.dr.dk/nyheder/seneste/') ? 'card' : 'article',
//           time: o!.time!,
//           body: o!
//             .body!.split(/\n+/g)
//             .map((line) => {
//               return line.trim()
//             })
//             .filter((line) => {
//               return !!line
//             }),
//         } as Article
//       })

//     filtered.forEach((article) => {
//       db.prepare(
//         `
//         INSERT INTO articles (url, type, time, category, heading, summary)
//         VALUES (@url, @type, @time, @category, @heading, @summary)
//         ON CONFLICT(url) DO NOTHING
//       `
//       ).run({
//         ...article,
//         time: parseTime(article.time).getTime(),
//         summary: article.summary ?? null,
//       })
//     })

//     await forEachAsync(
//       filtered,
//       async (article) => {
//         if (article.type === 'article') {
//           try {
//             const cachedRow = db
//               .prepare(`SELECT summary FROM articles WHERE url = ? AND summary IS NOT NULL`)
//               .get(article.url) as any
//             if (cachedRow && cachedRow.summary) return
//             const newBody = (await scrapeArticle(context, article.url)) ?? []
//             article.body = newBody
//           } catch (error) {
//             console.error('Fejl ved scraping af artikel:', error)
//           }
//         }
//       },
//       { concurrency: 5 }
//     )

//     return filtered
//   } finally {
//     await forEachAsync(browser.contexts(), async (context) => {
//       await forEachAsync(context.pages(), async (page) => {
//         try {
//           await page.close()
//         } catch (_) {
//           //
//         }

//         try {
//           await context.close()
//         } catch (_) {
//           //
//         }
//       })
//     })
//     await browser.close()
//   }
