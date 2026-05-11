import { DR_DK_NYHEDER_URL } from './cheerio'
import { articlesInsertSchema } from '../../common/schema'
import { articles as articlesSchema } from '../../common/schema'
import { browserSession } from './withBrowser'
import { db } from '../db'
import { forEachAsync } from 'es-toolkit'
import { publishersInsertSchema } from '../../common/schema'
import { publishers as publishersSchema } from '../../common/schema'
import { uniqBy } from 'es-toolkit'

export async function scrapeDR() {
  return await browserSession(
    { headless: true },
    async ({ contextSession }) =>
      await contextSession({}, async ({ context, pageSession }) => {
        context.setDefaultTimeout(30000)
        context.setDefaultNavigationTimeout(30000)

        const scrapeResult = await pageSession(async (page) => {
          console.log('Navigerer til dr.dk/nyheder...')
          await page.goto(DR_DK_NYHEDER_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 30_000,
          })

          await page.waitForSelector('li.hydra-latest-news-page__short-news-item')

          return await page.evaluate(() =>
            Array.from(document.querySelectorAll('li.hydra-latest-news-page__short-news-item'))
              // .slice(0, 5) // TODO
              .map((li) => {
                const article = li.querySelector('article')
                if (article) {
                  const [category, time] = Array.from(article.querySelectorAll('span.dre-teaser-meta-label')).map(
                    (el) => el.textContent?.trim() ?? ''
                  )

                  const url =
                    article
                      .querySelector(
                        'div.hydra-latest-news-page-short-news-article__share div.dre-share-link-copy-url__copy-link-hidden'
                      )
                      ?.innerHTML?.trim() || ''

                  const heading =
                    article
                      .querySelector('div.hydra-latest-news-page-short-news-article__heading')
                      ?.textContent?.trim() || ''

                  const summary =
                    (
                      article.querySelector(
                        'div.hydra-latest-news-page-short-news-article__body > div.hydra-latest-news-page-short-news-article__body'
                      ) as HTMLElement
                    )?.innerText?.trim() || ''

                  return { url, time, category, heading, summary }
                }

                const card = li.querySelector('div.hydra-latest-news-page-short-news-card')
                if (card) {
                  const [category, time] = Array.from(
                    li
                      .querySelector('div.hydra-latest-news-page-short-news-card__meta')
                      ?.querySelectorAll('span.dre-teaser-meta-label') ?? []
                  ).map((el) => el.textContent?.trim() ?? '')

                  const url =
                    (
                      li.querySelector(
                        'div.hydra-latest-news-page-short-news-card__title a'
                      ) as HTMLAnchorElement | null
                    )?.href?.trim() || ''

                  const heading =
                    li.querySelector('div.hydra-latest-news-page-short-news-card__title')?.textContent?.trim() ||
                    ''

                  const summary =
                    li.querySelector('p.hydra-latest-news-page-short-news-card__summary')?.innerHTML?.trim() || ''

                  return { url, time, category, heading, summary }
                }
              })
          )
        })

        // console.log({ scrapeResult })

        const cleaned = scrapeResult
          .filter((o) => !!o)
          .filter((o): o is Required<typeof o> => Object.values(o).every((v) => !!v))
          .map((o) => {
            o = { ...o }
            const parsedUrl = new URL(o.url)
            const paths = parsedUrl.pathname.split('/').filter(Boolean)
            const pathname = '/' + paths.join('/')
            const area = paths.shift()!
            const category = paths[0]

            return { ...o, category, area, parsedUrl, pathname }
          })
          .map((o) => {
            const publishedAt = new Date()
            if (o.time.includes('min. siden')) {
              const mins = o.time.split(' ')[0]
              publishedAt.setMinutes(publishedAt.getMinutes() - Number(mins))
            } else {
              const [d, hhmm] = o.time.split(' kl. ')
              const [hh, mm] = hhmm.split(':').map(Number)
              if (d === 'I går') {
                publishedAt.setDate(publishedAt.getDate() - 1)
              }
              publishedAt.setHours(hh, mm, 0, 0)
            }
            return { ...o, publishedAt }
          })
          .map((o) => ({
            ...o,
            publisher: {
              name: (o.parsedUrl.origin.split('.').slice(-2, -1)[0]! + ' ' + o.area).toUpperCase(),
              url: [o.parsedUrl.origin, o.area].join('/'),
            },
          }))

        const publishersInsertData = uniqBy(
          cleaned.map((o) => o.publisher),
          (o) => o.url
        ).map((o) => publishersInsertSchema.parse(o))
        // console.log({ publishersInsertData })

        for (const o of publishersInsertData) {
          await db.insert(publishersSchema).values({ name: o.name, url: o.url }).onConflictDoNothing()
        }

        const newPublishers = await db.select().from(publishersSchema)

        // console.log({ newPublishers })

        const articlesInsertData = cleaned
          .map((o) => ({
            publisherId: newPublishers.find((p) => p.url === o.publisher.url)!.id,
            pathname: o.pathname,
            category: o.category,
            heading: o.heading,
            summary: o.summary,
            publishedAt: o.publishedAt,
          }))
          .map((o) => articlesInsertSchema.parse(o))
        // console.log({ articlesInsertData })

        await forEachAsync(
          articlesInsertData,
          async (o) =>
            (await db
              .insert(articlesSchema)
              .values(o)
              .onConflictDoNothing({
                target: [articlesSchema.publisherId, articlesSchema.pathname],
              })) as never
        )
      })
  )
}
