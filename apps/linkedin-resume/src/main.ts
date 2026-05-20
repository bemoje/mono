import { CONFIG_PATH } from './constants'
import type { CliOptions } from './types/CliOptions'
import { Command } from 'commander'
import cp from 'child_process'
import fs from 'fs-extra'
import { loadUserConfig } from './loadUserConfig'
import { renderPdfFromHtml } from './renderPdfFromHtml'
import { renderResumeHtml } from './renderResumeHtml'
import { renderResumeJson } from './renderResumeJson'
import { renderResumeMd } from './renderResumeMd'
import { scrapeLinkedIn } from './scrapeLinkedIn'
import { timer } from '@mono/node'
import upath from 'upath'
import { userLogin } from './userLogin'

const pkg = fs.readJsonSync(
  upath.joinSafe(upath.dirname(process.argv[1]), ...(process.argv[1].endsWith('ts') ? ['..'] : []), 'package.json')
)

const cli = new Command('linkedin-resume')
  .version(pkg.version)
  .description(pkg.description)

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
        await timer('login', (logger) => {
          return userLogin(options, logger)
        })
        await timer('scrape', (logger) => {
          return scrapeLinkedIn(options, logger)
        })
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
