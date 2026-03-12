import objectHash from 'object-hash'
import upath from 'upath'
import fs from 'fs-extra'
import { glob } from 'glob'
import { mapAsync } from 'es-toolkit'

if (!process.argv[2]) {
  throw new Error('Workspace directory path is required. Usage: node createWorkspaceHash.ts <workspace-dirpath>')
}

const wsDirpath = upath.normalize(process.argv[2])

if (!fs.existsSync(wsDirpath)) {
  throw new Error('Invalid workspace directory path. Usage: node createWorkspaceHash.ts <workspace-dirpath>')
}

const filepaths = new Set<string>()

const repoRootFiles = (
  await glob(
    ['{tsconfig,tsconfig.paths}.json', 'scripts/build-lib-bundle.mjs', 'scripts/createWorkspaceHash.ts'],
    { nodir: true, nocase: true, magicalBraces: true }
  )
).map(upath.normalizeSafe)

repoRootFiles.forEach((fp) => {
  return filepaths.add(fp)
})

await getWorkspaceFiles(wsDirpath)

async function getWorkspaceFiles(wsDirpath: string, seen = new Set<string>()) {
  if (seen.has(wsDirpath)) {
    return
  }
  seen.add(wsDirpath)

  const wsRootFiles = (await glob([`${wsDirpath}/*.{mjs,json}`], { nodir: true })).map(upath.normalizeSafe)
  wsRootFiles.forEach((fp) => {
    return filepaths.add(fp)
  })

  const wsSourceFiles = (
    await glob([`${wsDirpath}/src/**/*.ts`], { nodir: true, magicalBraces: true, ignore: ['**/*.test.ts'] })
  ).map(upath.normalizeSafe)

  wsSourceFiles.forEach((fp) => {
    return filepaths.add(fp)
  })

  const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))

  const wsDirpaths = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    .filter((dep) => {
      return dep.startsWith('@mono/')
    })
    .map((dep) => {
      return dep.replace('@mono/', 'libs/')
    })

  for (const depWsDirpath of wsDirpaths) {
    await getWorkspaceFiles(depWsDirpath, seen)
  }
}

const sorted = [...filepaths].toSorted()

const sourceFileContents = await mapAsync(sorted, async (filepath) => {
  try {
    const content =
      filepath.endsWith('.json') ?
        JSON.parse((await fs.readFile(filepath, 'utf8')).trim()) //
      : (await fs.readFile(filepath, 'utf8')).trim()
    return { filepath, content }
  } catch (_) {
    return { filepath, content: (await fs.readFile(filepath, 'utf8')).trim() }
  }
})

const buildHash = objectHash(sourceFileContents)

const buildHashFilepath = upath.joinSafe(wsDirpath, '.cache', '.build.hash')
const currentBuildHash =
  fs.existsSync(buildHashFilepath) ? (await fs.readFile(buildHashFilepath, 'utf8')).trim() : ''

// console.log({ currentBuildHash, buildHash })

const shouldBuild = !currentBuildHash || currentBuildHash !== buildHash
if (shouldBuild) {
  console.log(buildHash)
}
