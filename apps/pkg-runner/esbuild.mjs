import * as esbuild from 'esbuild'
import colors from 'ansi-colors'
import cp from 'child_process'
import fs from 'fs-extra'
import upath from 'upath'

const repoRootDirpath = (() => {
  const parts = upath.normalizeSafe(import.meta.dirname).split('/')
  const i = parts.lastIndexOf('mono')
  if (i === -1) {
    throw new Error('Could not find repo root directory')
  }
  return parts.slice(0, i + 1).join('/')
})()

const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const wsDirname = upath.basename(wsDirpath)

const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')
const indexFilepath = upath.joinSafe(wsDirpath, 'src', 'main.ts')

const distDir = upath.joinSafe(wsDirpath, 'dist')
const indexOutFilepath = upath.joinSafe(distDir, `${wsDirname}.cjs`)

const rootPkg = await fs.readJson(upath.joinSafe(repoRootDirpath, 'package.json'))

const packageJsonFilepath = upath.joinSafe(wsDirpath, 'package.json')
const pkg = await fs.readJson(packageJsonFilepath)

const distPkgName = [
  pkg.publishConfig?.scope ?? (pkg.name.includes('/') ? pkg.name.split('/')[0] : undefined),
  pkg.publishConfig?.name ?? (pkg.name.includes('/') ? pkg.name.split('/').slice(1).join('/') : pkg.name),
]
  .filter(Boolean)
  .join('/')

if (process.env.CI) {
  let npmVersion
  try {
    npmVersion = cp.execSync(`npm view ${distPkgName} version`, { encoding: 'utf8' })
  } catch (_) {
    console.error(`Package ${distPkgName} not found in npm registry.`)
    process.exit(1)
  }

  if (npmVersion.toString().trim() === pkg.version) {
    console.log(colors.green(`Package ${distPkgName}@${pkg.version} is already published. Skipping build.`))
    process.exit(0)
  }
}

console.log('Build started')

await fs.emptyDir(distDir)

// build with esbuild
await esbuild.build({
  entryPoints: [indexFilepath],
  bundle: true,
  outfile: indexOutFilepath,
  tsconfig: tsconfigFilepath,
  platform: 'node',
  format: 'cjs',
  target: ['node20', 'esnext'],
  minify: false,
  mainFields: ['module', 'main'],
  treeShaking: true,
  external: Object.keys(pkg.dependencies),
  banner: { js: '#!/usr/bin/env node' },
  logOverride: { 'empty-import-meta': 'silent' },
})

// create bin wrapper for cross-platform npx support
await fs.outputFile(
  upath.joinSafe(distDir, `${wsDirname}.mjs`),
  `#!/usr/bin/env node\nimport("./${wsDirname}.cjs");\n`
)

await fs.outputFile(
  upath.joinSafe(distDir, 'package.json'),
  JSON.stringify(
    {
      ...pkg,
      name: distPkgName,
      bin: { [wsDirname]: `./${wsDirname}.cjs` },
      main: `./${wsDirname}.cjs`,
      module: `./${wsDirname}.mjs`,
      files: [`${wsDirname}.mjs`, `${wsDirname}.cjs`],
      license: rootPkg.license,
      author: rootPkg.author,
      repository: { ...rootPkg.repository, directory: `apps/${wsDirname}` },
      scripts: undefined,
      devDependencies: undefined,
      packageManager: undefined,
      publishConfig: undefined,
    },
    null,
    2
  )
)

await fs.copyFile(upath.joinSafe(wsDirpath, 'README.md'), upath.joinSafe(distDir, 'README.md'))

console.log(colors.green('✓ Build completed'))

cp.execSync('npx --yes publint --level warning --pack npm', {
  cwd: distDir,
  stdio: 'inherit',
})

// CJS
const cjsFilepath = upath.joinSafe(distDir, `${wsDirname}.cjs`)
const cjsOut = cp
  .execSync(`node ${cjsFilepath} --help`, {
    cwd: repoRootDirpath,
    encoding: 'utf8',
  })
  .trim()
if (!cjsOut.includes(wsDirname)) {
  console.log({ cjsOut })
  console.error(`CJS build did not produce a valid module: ${cjsFilepath}`)
  process.exit(1)
}

// ESM
const mjsFilepath = upath.joinSafe(distDir, `${wsDirname}.mjs`)
const mjsOut = cp
  .execSync(`node ${mjsFilepath} --help`, {
    cwd: repoRootDirpath,
    encoding: 'utf8',
  })
  .trim()
if (!mjsOut.includes(wsDirname)) {
  console.log({ mjsOut })
  console.error(`ESM build did not produce a valid module: ${mjsFilepath}`)
  process.exit(1)
}

console.log(colors.green('✓ Build validation success'))
