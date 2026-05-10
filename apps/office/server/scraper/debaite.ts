import type { Article } from './types'
import { and } from 'drizzle-orm'
import { articles } from '../../common/schema'
import cp from 'child_process'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { officeApiBaseUrl } from '../config'

/**
 * Removes click-bait from news article heading.
 */
export const debaite = (
  () =>
  async (article: Article): Promise<Article> => {
    const existingRows = await db
      .select({ heading: articles.heading, summary: articles.summary })
      .from(articles)
      .where(and(eq(articles.origin, article.origin), eq(articles.pathname, article.pathname)))
    const existing = existingRows[0]

    if (existing && existing.heading && existing.summary) {
      article.heading = existing.heading
      article.summary = existing.summary
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

      const updated = { ...article, heading: heading.trim(), summary: summary.trim() }

      await db
        .update(articles)
        .set({
          heading: updated.heading,
          summary: updated.summary,
        })
        .where(and(eq(articles.origin, updated.origin), eq(articles.pathname, updated.pathname)))

      try {
        await fetch(new URL('/api/stream/scraped', officeApiBaseUrl), {
          method: 'POST',
          body: JSON.stringify({ type: 'update' }),
        })
      } catch (_err) {
        // IGNORE
      }

      return updated
    } catch (error) {
      console.error(error)
      return article
    }
  }
)()
