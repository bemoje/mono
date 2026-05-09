import { createNewArticleChecker } from '../../../server/scraper/cheerio'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

// A basic placeholder unit test
describe('cheerio scraper', () => {
  it('creates an article checker', () => {
    const checker = createNewArticleChecker()
    expect(typeof checker).toBe('function')
  })

  it('fetches the latest article heading', async () => {
    const checker = createNewArticleChecker()
    const hasNewArticles = await checker()
    expect(typeof hasNewArticles).toBe('boolean')
  })
})
