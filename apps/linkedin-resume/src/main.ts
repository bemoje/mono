import { Command } from 'commander'
import { scrapeLinkedIn } from './scrapeLinkedIn'
import { renderResumeHtml } from './renderResumeHtml'
import { renderResumeJson } from './renderResumeJson'
import { renderPdfFromHtml } from './renderPdfFromHtml'
import { loadUserConfig } from './loadUserConfig'
import type { CliOptions } from './types/CliOptions'
import { CONFIG_PATH, DIST_PATH } from './constants'
import fs from 'fs-extra'
import cp from 'child_process'
import { ensureUserLoggedInToLinkedIn } from './linkedin/ensureUserLoggedInToLinkedIn'
import description from './core/description'
import version from './core/version'

const cli = new Command('linkedin-resume')
  .version(version)
  .description(description)

  .option('-o, --outpath <filepath>', 'output filepath (overrides config)')

  .option('-d, --debug', 'enable debug output')
  .option('-r, --render', 'skip scraping, only render')
  .option('-n, --no-headless', 'show scraping browser window')
  .option('-k, --keep-open', 'keep browser open after scraping')

  .action(async (options: CliOptions) => {
    const config = await loadUserConfig()

    if (options.debug) {
      console.log({ argv: process.argv })
      console.dir({ config }, { depth: null })
    }

    if (!options.render) {
      console.log('\nEnsuring logged in to LinkedIn...')
      await ensureUserLoggedInToLinkedIn()

      console.log('\nClearing previous scrape data...')
      await fs.emptyDir(DIST_PATH)

      console.log('\nScraping LinkedIn...')
      await scrapeLinkedIn(options)
    }

    console.log('\nRendering resume...')
    await renderResumeJson()
    await renderResumeHtml()
    await renderPdfFromHtml(options)
  })

cli
  .command('config')
  .description('Create or update config file with LinkedIn username and other settings')
  .option('--path', 'print the path to the config file and exit')
  .action(async (options: CliOptions & { path?: string }) => {
    await loadUserConfig()

    if (options.path) {
      console.log(CONFIG_PATH)
      return
    }

    cp.execSync(`code -w "${CONFIG_PATH}"`, { stdio: 'inherit' })
  })

void cli.parseAsync()
