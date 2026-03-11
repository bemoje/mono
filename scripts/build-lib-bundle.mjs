import colors from 'ansi-colors'
import cp from 'node:child_process'
import fs from 'fs-extra'
import { mapValues } from 'es-toolkit'
import upath from 'upath'

console.info(`Build started`)

const wsDirpath = process.cwd()
const distDir = upath.joinSafe(wsDirpath, 'dist')
const wsDirname = upath.basename(wsDirpath)
const rootPkg = await fs.readJson(upath.joinSafe(wsDirpath, '..', '..', 'package.json'))
const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))

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
const external = externalDeps
  .flatMap((name) => {
    return [name, `${name}/*`]
  })
  .flat()

const externalArgs = external
  .map((name) => {
    return `--external=${name}`
  })
  .join(' ')

// clean dist
await fs.remove(distDir)
await fs.ensureDir(distDir)

cp.execSync(`yarn tsup --dts-resolve --config tsup.config.mjs ${externalArgs}`, {
  cwd: wsDirpath,
  stderr: 'inherit',
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
          pkg.dependencies?.[dep]
            // || pkg.devDependencies?.[name]
            || rootPkg.dependencies?.[dep],
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

await fs.outputJson(
  upath.joinSafe(distDir, 'package.json'),
  {
    name: `@bemoje/${wsDirname}`,
    version: pkg.version,
    description: pkg.description,
    type: 'module',
    sideEffects: pkg.sideEffects,
    keywords: pkg.keywords,
    main: './lib/index.cjs',
    module: './lib/index.js',
    types: './lib/index.d.ts',
    files: ['./lib/index.js', './lib/index.d.ts', './lib/index.cjs', './lib/index.d.cts'],
    exports: mapValues(pkg.exports, () => {
      return {
        import: { types: './lib/index.d.ts', default: './lib/index.js' },
        require: { types: './lib/index.d.cts', default: './lib/index.cjs' },
      }
    }),
    dependencies,
    publishConfig: { access: 'public' },
    license: rootPkg.license,
    author: rootPkg.author,
    repository: { ...rootPkg.repository, directory: `libs/${wsDirname}` },
  },
  { spaces: 2 }
)

await fs.outputFile(
  upath.joinSafe(distDir, 'README.md'),
  (await fs.readFile(upath.joinSafe(wsDirpath, 'README.md'), 'utf8')) //
    // eslint-disable-next-line unicorn/better-regex
    .replaceAll(/\[(\*\*.+\*\*)\]\((.+)\)/g, (_, name) => {
      return name
    }) //
)

console.log(colors.green('✓ Build done'))
