import 'dotenv/config'
import { articlesRepo } from './repositories/articlesRepo'
import { createNewArticleChecker } from './scraper/cheerio'
import { debaite } from './scraper/debaite'
import { scrapeDR } from './scraper/playwright'

export async function runScraper() {
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

    for (const article of await articlesRepo.nonDebaited()) {
      await debaite(article)
    }

    await new Promise((resolve) => setTimeout(resolve, 60000))
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void runScraper()
}
