import * as cheerio from 'cheerio'

export const DR_DK_NYHEDER_URL = 'https://www.dr.dk/nyheder'

export function createNewArticleChecker() {
  let prevHeading = ''

  const getLatestHeading = async () => {
    const html = await (await fetch(DR_DK_NYHEDER_URL)).text()
    const $ = cheerio.load(html)
    const latestHeading = $('div.hydra-latest-news-page-short-news-article__heading').first().text().trim()
    return latestHeading
  }

  const hasNewArticles = async () => {
    console.log('Checking for new article headlines...')
    const latestHeading = await getLatestHeading()
    const isUnchanged = latestHeading && latestHeading === prevHeading
    console.log({ latestHeading, prevHeading, isUnchanged })
    prevHeading = latestHeading
    return !isUnchanged
  }

  return hasNewArticles
}
