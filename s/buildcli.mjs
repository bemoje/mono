import esbuild from 'esbuild'
import cp from 'child_process'
import upath from 'upath'
import fs from 'fs-extra'
import { getRepoRootDirpath } from './util/getRepoRootDirpath.mjs'

const scriptpath = process.argv[1]
const WS_NAME = process.argv[2]
const REPO_ROOT = getRepoRootDirpath()
const WS_ROOT = upath.joinSafe(REPO_ROOT, 'apps', WS_NAME)
const CLI_ROOT = upath.joinSafe(REPO_ROOT, '.dist', 'apps', WS_NAME)
const esbuildEntryPointMain = 'src/main.ts'
const esbuildEntryPointActions = 'src/actions.ts'
const esbuildOutfileMain = 'cjs/main.js'
const esbuildOutfileActions = 'cjs/actions.js'
const binJsFile = 'bin/' + WS_NAME + '.js'
const versionSourceTsFile = 'src/core/version.ts'
const descriptionSourceTsFile = 'src/core/description.ts'
const buildJsonPath = upath.joinSafe(WS_ROOT, 'build.json')
const publicScope = 'bemoje'

console.log({
  scriptpath,
  WS_NAME,
  REPO_ROOT,
  WS_ROOT,
  CLI_ROOT,
  esbuildEntryPointMain,
  esbuildEntryPointActions,
  esbuildOutfileMain,
  esbuildOutfileActions,
  binJsFile,
  versionSourceTsFile,
  descriptionSourceTsFile,
  buildJsonPath,
})

const buildJson = fs.existsSync(buildJsonPath) ? fs.readJsonSync(buildJsonPath) : {}
const pkg = fs.readJsonSync(upath.joinSafe(WS_ROOT, 'package.json'))
const repoPkg = fs.readJsonSync(upath.joinSafe(REPO_ROOT, 'package.json'))

debug()
validateRepoPackageJson()
validateWorkspacePackageJson()

initDir()

writeNpmIgnore()
writePackageJson()
writeLicenseFile()

buildSource()
writeBinJs()
npmInstallDependencies()
assertBuildPrintsHelpText()
writeReadmeMd()

// buildBinaries()

//////////////
//////////////

function buildSource() {
  setCommanderVersion()
  setCommanderDescription()

  const outfileMain = upath.joinSafe(CLI_ROOT, esbuildOutfileMain)
  console.info(upath.relative(process.cwd(), outfileMain))
  esbuild.buildSync({
    tsconfig: upath.joinSafe(WS_ROOT, 'tsconfig.json'),
    entryPoints: [upath.joinSafe(WS_ROOT, esbuildEntryPointMain)],
    outfile: outfileMain,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node20'],
    keepNames: true,
    sourcemap: true,
    treeShaking: true,
    minify: true,
    external: ['level'],
  })

  const entryPointsActions = upath.joinSafe(WS_ROOT, esbuildEntryPointActions)
  if (fs.existsSync(entryPointsActions)) {
    const outfileActions = upath.joinSafe(CLI_ROOT, esbuildOutfileActions)
    console.info(upath.relative(process.cwd(), outfileActions))
    esbuild.buildSync({
      tsconfig: upath.joinSafe(WS_ROOT, 'tsconfig.json'),
      entryPoints: [entryPointsActions],
      outfile: outfileActions,
      bundle: true,
      platform: 'node',
      format: 'cjs',
      target: ['node20'],
      keepNames: true,
      sourcemap: true,
      treeShaking: true,
      minify: true,
      external: ['level'],
    })
  }

  function setCommanderVersion() {
    const code = fs.readFileSync(upath.joinSafe(WS_ROOT, versionSourceTsFile), 'utf8')
    const newCode = code.replace(/[0-9]+[.][0-9]+[.][0-9]/, pkg.version)
    outputFileSync(upath.joinSafe(WS_ROOT, versionSourceTsFile), newCode, 'utf8')
  }

  function setCommanderDescription() {
    const code = fs.readFileSync(upath.joinSafe(WS_ROOT, descriptionSourceTsFile), 'utf8')
    const newCode = code.replace(/[`][^`]+[`]/, '`' + pkg.description + '`')
    outputFileSync(upath.joinSafe(WS_ROOT, descriptionSourceTsFile), newCode, 'utf8')
  }
}

function buildBinaries() {
  const cwd = process.cwd()
  try {
    process.chdir(CLI_ROOT)
    cp.execSync('npm run build', { stdio: 'inherit' })
  } catch (error) {
    console.error(error)
  } finally {
    process.chdir(cwd)
  }
}

function npmInstallDependencies() {
  if (!buildJson.dependencies) return
  const cwd = process.cwd()
  try {
    process.chdir(CLI_ROOT)
    cp.execSync('npm install', { stdio: 'inherit' })
  } catch (error) {
    console.error(error)
  } finally {
    process.chdir(cwd)
  }
}

function getPublishedVersion(pkgName) {
  try {
    const json = cp.execSync('npm view ' + pkgName + ' --json').toString()
    return JSON.parse(json).version
  } catch (error) {
    return undefined
  }
}

function initDir() {
  fs.removeSync(CLI_ROOT, { recursive: true, force: true })
  fs.ensureDirSync(CLI_ROOT)
}

function writePackageJson() {
  return outputJsonSync(
    upath.joinSafe(CLI_ROOT, 'package.json'),
    {
      name: `@${publicScope}/${pkg.name}`,
      description: pkg.description,
      version: pkg.version,
      type: 'commonjs',
      main: esbuildOutfileMain,
      bin: { [WS_NAME]: binJsFile },
      preferGlobal: true,
      license: 'MIT',
      repository: repoPkg.repository,
      keywords: (pkg.keywords ?? []).concat('cli'),
      author: repoPkg.author,
      homepage: repoPkg.homepage,
      dependencies: buildJson.dependencies ?? {},
    },
    { spaces: 2 },
  )
}

function writeReadmeMd() {
  const content = [
    `# @${publicScope}/${pkg.name}`,
    ``,
    `${pkg.description}`,
    ``,
    `**Warning**: Private package. Do not expect it to work. Use at own risk.`,
    ``,
    `## Installation`,
    ``,
    '```sh',
    `# install`,
    `npm install @${publicScope}/${pkg.name} -g`,
    ``,
    `# uninstall`,
    `npm uninstall @${publicScope}/${pkg.name} -g`,
    ``,
    `# help`,
    `${WS_NAME} --help`,
    '```',
    ``,
    `## Help`,
    ``,
    '```',
    getHelpText(),
    '```',
    ``,
    `## License`,
    ``,
    `Released under the [MIT License](./LICENSE).`,
    ``,
  ].join('\n')

  outputFileSync(upath.joinSafe(WS_ROOT, 'README.md'), content)
  outputFileSync(upath.joinSafe(CLI_ROOT, 'README.md'), content)
}

function writeBinJs() {
  const entryPointsActions = upath.joinSafe(WS_ROOT, esbuildEntryPointActions)
  if (fs.existsSync(entryPointsActions)) {
    outputFileSync(
      upath.joinSafe(CLI_ROOT, binJsFile),
      [
        `#!/usr/bin/env node`, //
        `require('../${esbuildOutfileMain}').main('../${esbuildOutfileActions}')`,
      ].join('\n'),
    )
  } else {
    outputFileSync(
      upath.joinSafe(CLI_ROOT, binJsFile),
      [
        '#!/usr/bin/env node', //
        `require('../${esbuildOutfileMain}')`,
      ].join('\n'),
    )
  }
}

function writeNpmIgnore() {
  outputFileSync(
    upath.joinSafe(CLI_ROOT, '.npmignore'),
    [
      'package-lock.json', //
      'node_modules',
      '*.map',
    ].join('\n'),
  )
}

function writeLicenseFile() {
  outputFileSync(
    upath.joinSafe(CLI_ROOT, 'LICENSE'),
    [
      `MIT License`,
      ``,
      `Copyright (c) ${new Date().getFullYear()} ${repoPkg.author?.name}`,
      ``,
      `Permission is hereby granted, free of charge, to any person obtaining a copy`,
      `of this software and associated documentation files (the "Software"), to deal`,
      `in the Software without restriction, including without limitation the rights`,
      `to use, copy, modify, merge, publish, distribute, sublicense, and/or sell`,
      `copies of the Software, and to permit persons to whom the Software is`,
      `furnished to do so, subject to the following conditions:`,
      ``,
      `The above copyright notice and this permission notice shall be included in all`,
      `copies or substantial portions of the Software.`,
      ``,
      `THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR`,
      `IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,`,
      `FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE`,
      `AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER`,
      `LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,`,
      `OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE`,
      `SOFTWARE.`,
    ].join('\n'),
  )
}

function validateRepoPackageJson() {
  for (const key of ['repository', 'homepage', 'author']) {
    if (!repoPkg[key]) {
      throw new Error(`Missing required field "${key}" in repo package.json`)
    }
  }
}

function validateWorkspacePackageJson() {
  for (const key of ['name', 'version', 'description']) {
    if (!pkg[key]) {
      throw new Error(`Missing required field "${key}" in workspace package.json`)
    }
  }
}

function debug() {
  if (process.argv.slice(2).includes('--debug')) {
    // const version = pkg.version
    // const publishedVersion = getPublishedVersion(pkg.name)
    // const isNewVersion = publishedVersion !== version

    console.debug({
      scriptpath,
      WS_ROOT,
      REPO_ROOT,
      CLI_ROOT,
      WS_NAME,
      esbuildEntryPointMain,
      esbuildOutfileMain,
      esbuildEntryPointActions,
      esbuildOutfileActions,
      binJsFile,
      versionSourceTsFile,
      descriptionSourceTsFile,
      // version,
      // publishedVersion,
      // isNewVersion,
    })
  }
}

function outputFileSync(filepath, content) {
  printFilepath(filepath)
  fs.outputFileSync(filepath, content)
}

function outputJsonSync(filepath, object) {
  printFilepath(filepath)
  fs.outputJsonSync(filepath, object, { spaces: 2 })
}

function assertBuildPrintsHelpText() {
  const help = getHelpText()
  if (!help.includes(pkg.description)) {
    console.debug(help)
    console.error('Build validation failed. Could not get help output with correct version.')
    process.exit(1)
  }
}

function getHelpText() {
  const ST = '(?:\\u0007|\\u001B\\u005C|\\u009C)'
  const pattern = [
    `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  ].join('|')
  const ansi = new RegExp(pattern, 'g')
  return cp
    .execSync('node ' + upath.joinSafe(CLI_ROOT, binJsFile) + ' --help', { cwd: REPO_ROOT })
    .toString()
    .replace(ansi, '')
    .trim()
}

function printFilepath(filepath) {
  console.info(upath.relative(process.cwd(), filepath))
}
