import fs from 'fs-extra'
import upath from 'upath'
import { pathToFileURL } from 'url'
import { loadUserConfig } from './loadUserConfig'
import { CliOptions } from './types/CliOptions'
import { DIST_PATH } from './constants'
import { expandEnvVars } from './utils/expandEnvVars'
import puppeteer from 'puppeteer'

export async function renderPdfFromHtml(outputFilepath: string, options: CliOptions): Promise<void> {
  const htmlPath = upath.join(DIST_PATH, 'resume.html')
  const pdfPath = upath.join(DIST_PATH, 'resume.pdf')
  const htmlFileUrl = pathToFileURL(htmlPath).href

  if (!(await fs.pathExists(htmlPath))) {
    throw new Error(`HTML file not found: ${htmlPath}. Run renderResumeHtml first.`)
  }

  await fs.ensureDir(upath.dirname(pdfPath))

  if (options.debug) {
    console.log('Generating PDF from:', htmlFileUrl)
  }

  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(htmlFileUrl, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      format: 'A4',
      width: '8.26in',
      height: '11.69in',
      displayHeaderFooter: false,
      margin: { top: '0.4in', right: '0.35in', bottom: '0.4in', left: '0.35in' },
      preferCSSPageSize: true,
    })
  } finally {
    await browser.close()
  }

  if (!(await fs.pathExists(pdfPath))) {
    throw new Error(`PDF was not created at ${pdfPath}`)
  }

  console.log(`output: ${pdfPath}`)

  const userConfig = await loadUserConfig()
  const outputFilepathToUse = expandEnvVars(outputFilepath || userConfig.outputFilepath)
  await fs.ensureDir(upath.dirname(outputFilepathToUse))
  await fs.copy(pdfPath, outputFilepathToUse)
  console.log('PDF:', outputFilepathToUse)
}
