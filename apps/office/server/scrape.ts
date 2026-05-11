import 'dotenv/config'
import { createNewArticleChecker } from './scraper/cheerio'
import { debaite } from './scraper/debaite'
import { nonDebaitedArticles } from './repositories/articleRepo'
import { scrapeDR } from './scraper/playwright'

async function main() {
  const hasNewArticles = createNewArticleChecker()

  while (true) {
    try {
      if (!(await hasNewArticles())) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 5))
        continue
      }
    } catch (err) {
      console.error('Fejl ved pre-check (fast scrape), vi falder tilbage til Playwright:', err)
    }

    await scrapeDR()

    for (const article of await nonDebaitedArticles()) {
      await debaite(article)
    }

    await new Promise((resolve) => setTimeout(resolve, 60000))
  }
}

void main()
