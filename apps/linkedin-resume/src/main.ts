import { Command } from 'commander'
import { scrapeLinkedIn } from './scrapeLinkedIn'
import { renderResumeHtml } from './renderResumeHtml'
import { renderResumeJson } from './renderResumeJson'
import { renderPdfFromHtml } from './renderPdfFromHtml'
import { loadUserConfig } from './loadUserConfig'
import type { CliOptions } from './types/CliOptions'
import { CONFIG_PATH } from './constants'
import cp from 'node:child_process'
import { userLogin } from './userLogin'
import description from './core/description'
import version from './core/version'
import { timer } from '@mono/node'
import { renderResumeMd } from './renderResumeMd'

const cli = new Command('linkedin-resume')
  .version(version)
  .description(description)

  .option('-o, --outpath <filepath>', 'output filepath (overrides config)')

  .option('-d, --debug', 'enable debug output')
  .option('-r, --render', 'skip scraping, only render')
  .option('-n, --no-headless', 'show scraping browser window')
  .option('-k, --keep-open', 'keep browser open after scraping')

  .action(async (options: CliOptions) => {
    await timer('', async (logger) => {
      const config = await loadUserConfig()

      if (options.debug) {
        logger.debug({ argv: process.argv, config, options })
      }

      if (!options.render) {
        await timer('login', (logger) => userLogin(options, logger))
        await timer('scrape', (logger) => scrapeLinkedIn(options, logger))
      }

      await timer('render', async (logger) => {
        await renderResumeJson(logger)
        await renderResumeHtml(logger)
        await renderResumeMd(logger)
        await renderPdfFromHtml(options, logger)
      })
    })
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
