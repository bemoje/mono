import type { Page } from 'puppeteer'

export async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let lastHeight = document.body.scrollHeight
      let stableCount = 0
      const timer = setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight)
        const newHeight = document.body.scrollHeight
        if (newHeight === lastHeight) {
          if (++stableCount >= 3) {
            clearInterval(timer)
            resolve()
          }
        } else {
          stableCount = 0
          lastHeight = newHeight
        }
      }, 500)
      setTimeout(() => {
        clearInterval(timer)
        resolve()
      }, 60000)
    })
  })
  await new Promise((r) => setTimeout(r, 1000))
}
