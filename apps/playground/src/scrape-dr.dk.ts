import 'dotenv/config'
// import { GoogleGenAI } from '@google/genai'
import type { Page } from 'playwright'
import { chromium } from 'playwright'
import colors from 'ansi-colors'
import cp from 'child_process'
import { forEachAsync } from 'es-toolkit'
import fs from 'fs-extra'
import { mapAsync } from 'es-toolkit'

const scrapeJsonPath = 'apps/playground/src/scrape-dr.dk.json'
const cacheJsonPath = 'apps/playground/src/scrape-dr.dk.cache.json'
const cache = fs.existsSync(cacheJsonPath) ? fs.readJsonSync(cacheJsonPath) : ({} as Record<string, Article>)

export const debaite = (() => {
  // const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] })

  return async (article: Article): Promise<Article> => {
    if (
      !!cache[article.url] &&
      !!cache[article.url].oldHeading &&
      !!cache[article.url].heading &&
      !!cache[article.url].summary
    ) {
      article.oldHeading = cache[article.url].oldHeading.trim()
      article.heading = cache[article.url].heading.trim()
      article.summary = cache[article.url].summary.trim()
      return article
    }
    try {
      const [heading, summary] = cp
        .spawnSync(
          'claude',
          [
            '--effort',
            'medium',
            '--system-prompt',
            'Vi skal eliminere click bait artikler. Du får en nyhedsartikel med overskrift og brødtekst. Ofte er artikler så tynde i deres indhold, at overskriften er det eneste man vil vide. Men tit tilbageholder overskrifter information for at sikre læseren klikker ind på artiklen. Hvis en overskrift tilbageholder information (the bait), så skal du omskrive den til en mere informativ overskrift. Brødteksten (body) skal også reduceres så meget den overhovedet kan, og helst i korte og præcise summary sætninger. Din respons skal være den nye overskrift og den komprimerede brødtekst som en streng: "overskrift ;; komprimeret"',
            '--print',
            `heading: ${article.heading.replaceAll("'", '')} ;; body: ${article.body.join('\n').replaceAll("'", '')}`,
          ],
          { encoding: 'utf8' }
        )
        .stdout.split(' ;; ')
      console.log({ heading: heading.trim(), summary: summary.trim() })

      // const res = await ai.models.generateContent({
      //   model: 'gemini-2.5-flash-lite',
      //   contents: JSON.stringify({ heading: article.heading, body: article.body.join('\n') }),
      //   config: {
      //     systemInstruction: [
      //       'Vi skal eliminere click bait artikler.',
      //       'Du får en nyhedsartikel med overskrift og brødtekst.',
      //       'Ofte er artikler så tynde i deres indhold, at overskriften er det eneste man vil vide.',
      //       'Men tit tilbageholder overskrifter information for at sikre læseren klikker ind på artiklen.',
      //       'Hvis en overskrift tilbageholder information (the bait), så skal du omskrive den til en mere informativ overskrift, som også gerne må være lidt længere.',
      //       'Brødteksten (body) skal også komprimeres ned til maks. 3 korte og præcise sætninger.',
      //       'Din respons skal være den nye overskrift og den komprimerede brødtekst som en streng: `header | body`',
      //     ].join('\n'),
      //   },
      // })

      // const json = res.text?.trim() ?? ''
      // const [newHeading, summary] = json
      //   .split('|')
      //   .map((s) => {
      //     return s.trim()
      //   })
      //   .filter(Boolean)

      // console.log(article.heading + ' --> ' + heading)

      const updated = { ...article, oldHeading: article.heading, heading: heading.trim(), summary: summary.trim() }
      cache[article.url] = updated
      fs.writeJsonSync(cacheJsonPath, cache)

      return updated
    } catch (error) {
      console.error(error)
      return article
    }
  }
})()

// /**
//  * Convert a UTC date to local date by applying the timezone offset
//  */
// function localeDate(utc: Date = new Date()): Date {
//   const tzOffset = utc.getTimezoneOffset() * 60000
//   return new Date(utc.getTime() - tzOffset)
// }

interface Article {
  type: 'article' | 'card'
  time: string
  category: string
  heading: string
  summary: string
  body: string[]
  url: string
  oldHeading?: string
}

function parseTime(t: string) {
  const date = new Date()
  if (t.includes('min. siden')) {
    const mins = t.split(' ')[0]
    date.setMinutes(date.getMinutes() - Number(mins))
  } else {
    const [d, hhmm] = t.split(' kl. ')
    const [hh, mm] = hhmm.split(':').map((s) => {
      return Number(s)
    })
    date.setHours(hh, mm, 0, 0)
    if (d === 'I går') {
      date.setDate(date.getDate() - 1)
    }
  }
  return date
}

async function scrapeDR() {
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()

    console.log('Navigerer til dr.dk/nyheder...')
    await page.goto('https://www.dr.dk/nyheder', {
      waitUntil: 'networkidle',
      timeout: 30_000,
    })

    // Vent til mindst ét nyhedselement er synligt
    await page.waitForSelector('li.hydra-latest-news-page__short-news-item', { timeout: 15_000 })

    // Scroll til bunden for at lazy-loade flere artikler
    // await autoScroll(page)

    const articles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('li.hydra-latest-news-page__short-news-item')).map((li) => {
        // --- Article-variant ---
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
                  'div.hydra-latest-news-page-short-news-article__share ' +
                    'div.dre-share-link-copy-url__copy-link-hidden'
                )
                ?.innerHTML?.trim() ?? undefined,
            time,
            category,
            heading: article
              .querySelector('div.hydra-latest-news-page-short-news-article__heading')
              ?.textContent?.trim(),
            summary: '',
            body: article.querySelector(
              'div.hydra-latest-news-page-short-news-article__body > div.hydra-latest-news-page-short-news-article__body'
            )?.['innerText' as never] as string | undefined,
          }
        }

        // --- Card-variant ---
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
            summary: '',
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
        return {
          ...cache[o!.url!],
          ...o,
          type: o!.url!.startsWith('https://www.dr.dk/nyheder/seneste/') ? 'card' : 'article',
          time: parseTime(o!.time!).toISOString(),
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
    // .slice(0, 5) // TODO

    await forEachAsync(
      filtered,
      async (article) => {
        if (article.type === 'article') {
          try {
            const cached = cache[article.url]?.body
            if (cached?.length) {
              article.body = cached
              return
            }
            const newBody = await scrapeArticle(await browser.newPage(), article.url)
            article.body = newBody ?? []
            cache[article.url] = article
            await fs.writeJson(cacheJsonPath, cache)
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

/** Scroller langsomt til bunden så lazy-loadet indhold renderes */
async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0
      const distance = 400
      const timer = setInterval(() => {
        window.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 150)
    })
  })
  await page.waitForTimeout(2000)
}

async function scrapeArticle(page: Page, url: string) {
  try {
    console.log('Navigerer til artikel: ' + url)
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    })

    await page.waitForSelector('article', { timeout: 30_000 })

    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('article div.dre-speech')).map((el) => {
        return el.textContent.trim()
      })
    })
  } catch (error) {
    console.error('Fejl ved scraping af artikel:', error)
  }
}

function printArticles(articles: Article[]) {
  console.log('\\n' + colors.bold.underline('DR.DK NYHEDER (Anti-Clickbait)') + '\\n')
  for (const a of articles.slice().reverse()) {
    const timeStr = new Date(a.time)
      .toLocaleTimeString('da-DK', {
        weekday: 'narrow',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Copenhagen',
      })
      .split(' ')
      .reverse()
      .join(' ')
    const cat = colors.magenta(`[${a.category}]`)
    const time = colors.yellow(timeStr)
    const heading = colors.cyan.bold(a.heading)

    console.log(`${time} ${cat} ${heading}`)
    console.log(
      colors.green(
        `  ↳ ${a.summary || (a.body?.join(' ') || '').split('. ').slice(0, 2).join('.  ') + '.'}`.replace(
          /\.\.$/,
          '.'
        )
      )
    ) // summary
    console.log(colors.gray('  ↳ ') + colors.dim.gray.underline(`${a.url}`))
    console.log() // Empty line between articles
  }
}

function renderArticlesHtml(articles: Article[]) {
  const htmlParts = [
    '<!DOCTYPE html>',
    '<html lang="da">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>DR.DK NYHEDER (Anti-Clickbait)</title>',
    '  <link rel="stylesheet" href="https://www.dr.dk/global/publik-variable.css">',
    '  <style>',
    '    @font-face {',
    '      font-family: "Publik";',
    '      src: url("https://www.dr.dk/global/fonts/DRPublikUIVF-b49db5333dbc736c65cec4e56338975e.woff2") format("woff2");',
    '      font-weight: 300 700;',
    '      font-stretch: 50% 100%;',
    '      font-display: swap;',
    '    }',
    '    body { font-family: Publik, -apple-system, sans-serif; background: #f9fafb; color: #111827; max-width: 850px; margin: 2rem auto; padding: 0 1rem; line-height: 1.4; }',
    '    h1 { text-align: center; font-size: 1.75rem; font-weight: 800; margin-bottom: 2rem; color: #1f2937; letter-spacing: -0.025em; }',
    '    .article { background: white; padding: 0.3rem 0.75rem; margin-bottom: 0.25rem; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }',
    '    .meta { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.35rem; display: flex; gap: 0.5rem; align-items: center; }',
    '    .category { font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.7rem; }',

    '    .heading { font-size: 0.85rem; font-weight: 700; color: #111827; text-decoration: none; display: block; margin-bottom: 0.5rem; line-height: 1.3; max-width: 85%; }',
    '    .heading:hover { color: #2563eb; text-decoration: underline; }',
    '    .summary { font-size: 0.9rem; color: #4b5563; margin-bottom: 0.2rem; padding: 0.2rem; padding-top:0.3rem; border-top: 1px solid #e8eaec; }',
    '    .textbody { font-size: 0.9rem; color: #4b5563; margin-bottom: 0.2rem; padding: 0.2rem; padding-top:0.3rem; border-top: 1px solid #e8eaec; }',
    '    .hidden { display: none; }',
    '    .article.focused { border-color: #93c5fd; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }',
    '    .article { cursor: pointer; transition: all 0.1s ease; max-height: 400px; overflow: hidden; }',

    '  </style>',
    '</head>',
    '<body>',
    '  <h1>DR.DK NYHEDER</h1>',
  ]

  for (const a of articles) {
    const timeStr = new Date(a.time)
      .toLocaleTimeString('da-DK', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Copenhagen',
      })
      .split(' ')
      .reverse()
      .join(' ')

    const summary = (a.summary || '').replace(/\.\.$/, '.')

    htmlParts.push(
      `  <div class="article">`,
      `    <div class="meta">`,
      `      <span class="category">${a.category}</span>`,
      `      <span class="time">${timeStr}</span>`,
      `    </div>`,
      `    <a href="${a.url}" target="_blank" class="heading">${a.heading}</a>`,
      `    <div class="summary">${summary}</div>`,
      `    <div class="textbody hidden">${(a.body || []).join('<br>')}</div>`,
      `  </div>`
    )
  }

  htmlParts.push(
    `<script>`,
    `  window.addEventListener('DOMContentLoaded', () => {`,
    `    const articles = document.querySelectorAll('.article');`,
    `    let currentIndex = -1;`,
    ``,
    `    function setFocus(index, options={scrollIntoView:false}) {`,
    `      if (currentIndex >= 0 && articles[currentIndex]) {`,
    `        articles[currentIndex].classList.remove('focused');`,
    `      }`,
    `      currentIndex = index;`,
    `      if (currentIndex >= 0 && articles[currentIndex]) {`,
    `        const el = articles[currentIndex];`,
    `        el.classList.add('focused');`,
    `        if (options.scrollIntoView) {`,
    `          el.scrollIntoView({ behavior: 'smooth', block: 'center' });`,
    `        }`,
    `      }`,
    `    }`,
    ``,
    `    articles.forEach((article, index) => {`,
    `      let isClicked = false`,
    `      article.addEventListener('mousedown', (e) => {`,
    `        if (e.target.closest('a')) return; // let links work normally`,
    `        isClicked = true`,
    `        setFocus(index, { scrollIntoView: false });`,
    `      });`,
    `      article.addEventListener('mouseover', (e) => {`,
    `        setFocus(index, { scrollIntoView: false });`,
    `      });`,
    `      article.addEventListener('mouseout', (e) => {`,
    `        if(isClicked) {`,
    `          isClicked = false;`,
    `        } else {`,
    `          e.target.classList.remove('focused');`,
    `        }`,
    `      });`,
    `    });`,
    ``,
    `    window.addEventListener('keydown', (e) => {`,
    `      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {`,
    `        e.preventDefault();`,
    `        let nextIndex = currentIndex;`,
    `        if (e.key === 'ArrowDown') {`,
    `          nextIndex = currentIndex < articles.length - 1 ? currentIndex + 1 : articles.length - 1;`,
    `        } else {`,
    `          nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;`,
    `        }`,
    `        setFocus(nextIndex, { scrollIntoView: true });`,
    `      }`,
    `      if (e.key === 'ArrowLeft') {`,
    `        e.preventDefault();`,
    `        const el = articles[currentIndex];`,
    `        if (!el.querySelector('.textbody').classList.contains('hidden')) {`,
    `          el.querySelector('.textbody').classList.add('hidden');`,
    `        } else if (!el.querySelector('.summary').classList.contains('hidden')) {`,
    `          el.querySelector('.summary').classList.add('hidden');`,
    `        }`,
    `      }`,
    `      if (e.key === 'ArrowRight') {`,
    `        e.preventDefault();`,
    `        const el = articles[currentIndex];`,
    `        if(el.querySelector('.summary').classList.contains('hidden')) {`,
    `          el.querySelector('.summary').classList.remove('hidden')`,
    `        } else {`,
    `          el.querySelector('.textbody').classList.remove('hidden')}`,
    `        }`,
    `      if ((e.key === 'Enter' || e.key === ' ') && currentIndex >= 0) {`,
    `        e.preventDefault();`,
    `        const link = articles[currentIndex].querySelector('a');`,
    `        if (link) window.open(link.href, '_blank');`,
    `      }`,
    `      if (e.key === 'Escape') {`,
    `          e.target.classList.remove('focused');`,
    `      }`,
    `    });`,
    `  });`,
    `</script>`
  )

  htmlParts.push('</body>', '</html>')

  const outPath = scrapeJsonPath.replace('.json', '.html')
  fs.writeFileSync(outPath, htmlParts.join('\n'))
  console.log('\\n' + colors.cyan(`Generated HTML: ${outPath}`))
}

async function main() {
  const articles = await scrapeDR()
  console.log(`\nFandt ${articles.length} artikler:\n`)

  const updatedArticles = await mapAsync(articles, debaite, { concurrency: 5 })
  await fs.writeFile(scrapeJsonPath, JSON.stringify(updatedArticles, null, 2))
  console.log(`\nUpdated ${updatedArticles.length} artikler:\n`)

  console.log(scrapeJsonPath)

  printArticles(updatedArticles)
  renderArticlesHtml(updatedArticles)
}

void main()
