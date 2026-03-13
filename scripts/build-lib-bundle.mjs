/* eslint-disable max-lines-per-function */
import colors from 'ansi-colors'
import cp from 'node:child_process'
import fs from 'fs-extra'
import upath from 'upath'

const wsDirpath = process.cwd()
const distDir = upath.joinSafe(wsDirpath, 'dist')
const wsDirname = upath.basename(wsDirpath)
const rootDirpath = upath.joinSafe(wsDirpath, '..', '..')

////

const saveBuildHash = await createBuildHash()
await build()
await validateBuild()
await saveBuildHash()

////

/**
 * Create a hash of all the source files and dependencies in the workspace to determine if a build is necessary. If the hash matches the previously saved hash, skip the build. Otherwise, return a function that will save the new hash after the build is complete.
 */
async function createBuildHash() {
  console.log('Checking for changes...')

  const buildHash = cp.execSync(`yarn createWorkspaceHash libs/${wsDirname}`, {
    cwd: rootDirpath,
    // stdio: 'inherit',
    encoding: 'utf8',
    shell: 'powershell',
  })

  if (!buildHash) {
    console.log(colors.yellow('No changes detected. Skipping build.'))
    process.exit(0)
  }

  const buildHashFilepath = upath.joinSafe(wsDirpath, '.cache', '.build.hash')

  console.log(colors.green(`Changes detected. New hash: ${buildHash}`))

  return async () => {
    await fs.outputFile(buildHashFilepath, buildHash)
    console.log(colors.green(`Build hash updated`))
  }
}

/**
 * Build the library bundle using tsup, then create a package.json in the dist directory with the correct dependencies and exports. Finally, copy the README.md file to the dist directory and update any links to point to the correct files.
 */
async function build() {
  const rootPkg = await fs.readJson(upath.joinSafe(rootDirpath, 'package.json'))
  const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))

  await fs.emptyDir(distDir)

  const externalDeps = Array.from(
    new Set(
      Object.keys({
        ...rootPkg.dependencies,
        // ...rootPkg.devDependencies,
        ...pkg.dependencies,
        // ...pkg.devDependencies,
      })
    )
  ).filter((name) => {
    return !name.startsWith('@types/') && !name.startsWith('@mono/') && !name.startsWith('type-fest')
  })

  const externalArgs = externalDeps
    .flatMap((name) => {
      return [name, `${name}/*`]
    })
    .flat()
    .map((name) => {
      return `--external=${name}`
    })
    .join(' ')

  cp.execSync(`yarn tsup --dts-resolve --config tsup.config.mjs ${externalArgs}`, {
    cwd: wsDirpath,
    stdio: 'inherit',
  })

  const outCode = [
    await fs.readFile('dist/lib/index.d.ts', 'utf8'),
    await fs.readFile('dist/lib/index.js', 'utf8'),
  ].join('\n')

  const dependencies = {
    ...Object.fromEntries(
      externalDeps
        .filter((dep) => {
          return !dep.startsWith('@mono/')
        })
        .filter((dep) => {
          return new RegExp(` from ["']${dep}(["']|[/][^"']+["'])`).test(outCode)
        })
        .map((dep) => {
          return [
            dep,
            pkg.dependencies?.[dep] ||
              // || pkg.devDependencies?.[name]
              rootPkg.dependencies?.[dep],
            // || rootPkg.devDependencies?.[name]
          ]
        })
    ),

    ...pkg.dependencies,
  }

  for (const dep of Object.keys(dependencies)) {
    if (dep.startsWith('@mono/')) {
      delete dependencies[dep]
    }
  }

  const ALL_DEPS = {
    ...rootPkg.dependencies,
    ...rootPkg.devDependencies,
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }
  Object.entries(dependencies).forEach(([dep]) => {
    const asType = `@types/${dep}`
    if (ALL_DEPS[asType]) {
      dependencies[asType] = ALL_DEPS[asType]
    }
  })

  const exportDef = {
    import: { types: './lib/index.d.ts', default: './lib/index.js' },
    require: { types: './lib/index.d.cts', default: './lib/index.cjs' },
  }

  await fs.outputJson(
    upath.joinSafe(distDir, 'package.json'),
    {
      name: `@bemoje/${wsDirname}`,
      version: pkg.version,
      description: pkg.description,
      type: 'module',
      sideEffects: pkg.sideEffects,
      publishConfig: { access: 'public' },
      dependencies,
      keywords: pkg.keywords,
      main: './lib/index.cjs',
      module: './lib/index.js',
      types: './lib/index.d.ts',
      files: ['./lib/index.js', './lib/index.d.ts', './lib/index.cjs', './lib/index.d.cts'],
      exports: { '.': exportDef, './*': exportDef },
      repository: { ...rootPkg.repository, directory: `libs/${wsDirname}` },
      author: rootPkg.author,
      license: rootPkg.license,
    },
    { spaces: 2 }
  )

  await fs.outputFile(
    upath.joinSafe(distDir, 'README.md'),
    (await fs.readFile(upath.joinSafe(wsDirpath, 'README.md'), 'utf8')) //

      .replaceAll(/\[(\*\*.+\*\*)\]\((.+)\)/g, (_, name) => {
        return name
      }) //
  )

  console.log(colors.green('✓ Build files created'))
}

/**
 * Validate the build by running publint and attw to ensure that the package is ready for publishing.
 */
async function validateBuild() {
  cp.execSync('npx --yes publint --level warning --pack npm', {
    cwd: distDir,
    stdio: 'inherit',
    encoding: 'utf8',
    shell: 'powershell',
  })
  cp.execSync('npx --yes @arethetypeswrong/cli --pack dist', {
    stdio: 'inherit',
    encoding: 'utf8',
    shell: 'powershell', //
  })
  console.log(colors.green('✓ Build validation success'))
}
