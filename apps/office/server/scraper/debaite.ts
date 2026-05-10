import type { Article } from './types'
import cp from 'child_process'
import db from '../db'
import { officeApiBaseUrl } from '../config'
import { parseTime } from './playwright'

/**
 * Removes click-bait from news article heading.
 */
export const debaite = (() => {
  return async (article: Article): Promise<Article> => {
    const existing = db.prepare(`SELECT heading, summary FROM articles WHERE url = ?`).get(article.url) as
      | { heading?: string; summary?: string }
      | undefined
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

      db.prepare(
        `
        INSERT INTO articles (url, type, time, category, heading, summary)
        VALUES (@url, @type, @time, @category, @heading, @summary)
        ON CONFLICT(url) DO UPDATE SET
          heading=excluded.heading,
          summary=excluded.summary
      `
      ).run({
        ...updated,
        time: parseTime(updated.time).getTime(),
      })

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
})()
