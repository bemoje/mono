import { ApiReponseCache } from '../cache/ApiReponseCache'
import { articles } from 'apps/office/common/schema'
import type { articlesRepo } from '../repositories/articlesRepo'
import cp from 'child_process'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { getAppDataPath } from '@mono/os'

type Article = Omit<Awaited<ReturnType<typeof articlesRepo.findAllWithPublisher>>[number], 'publisher'>

export const cache = new ApiReponseCache<{ debaitedHeading: string; debaitedSummary: string }>({
  dirpath: getAppDataPath('bemoje', 'office', 'cache', 'claude-article-headlines'),
  maxAgeMs: 1000 * 60 * 60 * 24 * 30,
})

async function cached(article: Article) {
  const args = [
    ['--model', 'Haiku'],

    ['--effort', 'medium'],

    [
      '--system-prompt',
      'Vi skal eliminere click bait artikler. Du får en nyhedsartikel med overskrift og brødtekst. Ofte er artikler så tynde i deres indhold, at overskriften er det eneste man vil vide. Men tit tilbageholder overskrifter information for at sikre læseren klikker ind på artiklen. Hvis en overskrift tilbageholder information (the bait), så skal du omskrive den til en mere informativ overskrift. Brødteksten (body) skal også reduceres så meget den overhovedet kan, og helst i korte og præcise summary sætninger. Din respons skal være den nye overskrift og den komprimerede brødtekst som en streng: "overskrift ;; komprimeret"',
    ],

    '--print',

    `heading: ${article.heading.replaceAll("'", '')} ;; body: ${article.summary.replaceAll("'", '')}`,
  ].flat()

  const hash = cache.hashKey(args)
  const cached = await cache.get(hash)
  if (cached) return cached

  const newValue = cp
    .spawnSync('claude', args, { encoding: 'utf8' })
    .stdout.split(' ;; ')
    .map((s) => s?.trim() || '')
    .reduce(
      (acc, curr, index) => {
        if (index === 0) acc.debaitedHeading = curr
        else acc.debaitedSummary = curr
        return acc
      },
      {} as { debaitedHeading: string; debaitedSummary: string }
    )
  await cache.set(hash, newValue)
  console.log(newValue)
  return newValue
}

/**
 * Removes click-bait from news article heading.
 */
export async function debaite(article: Article) {
  try {
    const { debaitedHeading, debaitedSummary } = await cached(article)
    const updated = { id: article.id, debaitedHeading, debaitedSummary }
    await db.update(articles).set({ debaitedHeading, debaitedSummary }).where(eq(articles.id, article.id))
    console.log({ updated })
    return updated
  } catch (error) {
    console.error(error)
    return article
  }
}
