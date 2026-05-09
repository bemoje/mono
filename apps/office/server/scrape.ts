import 'dotenv/config'
import { createNewArticleChecker } from './scraper/cheerio'
import { debaite } from './scraper/debaite'
import { mapAsync } from 'es-toolkit'
import { scrapeDR } from './scraper/playwright'

async function main() {
  const hasNewArticles = createNewArticleChecker()

  while (true) {
    try {
      if (!(await hasNewArticles())) {
        await new Promise((resolve) => {
          return setTimeout(resolve, 1000 * 60 * 5)
        })
        continue
      }
    } catch (err) {
      console.error('Fejl ved pre-check (fast scrape), vi falder tilbage til Playwright:', err)
    }

    const articles = await scrapeDR()
    console.log(`Fandt ${articles.length} artikler:`)

    const updatedArticles = await mapAsync(articles, debaite, { concurrency: 5 })
    console.log(`Updated ${updatedArticles.length} artikler:`)

    await new Promise((resolve) => {
      return setTimeout(resolve, 60000)
    })
  }
}

void main()
