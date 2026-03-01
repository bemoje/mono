import cp from 'child_process'
import fs from 'fs-extra'
import upath from 'upath'

const wsDirpath = process.cwd()
const distDir = upath.joinSafe(wsDirpath, 'dist')
const wsDirname = upath.basename(wsDirpath)
const rootPkg = await fs.readJson(upath.joinSafe(wsDirpath, '..', '..', 'package.json'))
const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))

const externalDeps = Array.from(
  new Set(
    Object.keys({
      ...rootPkg.dependencies,
      ...rootPkg.devDependencies,
      ...pkg.dependencies,
      ...pkg.devDependencies,
    })
  )
).filter((name) => {
  return !name.startsWith('@types/')
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

cp.execSync(`yarn tsup --config tsup.config.mjs ${externalArgs}`, { cwd: wsDirpath, stdio: 'inherit' })

function depVersion(name) {
  return (
    pkg.dependencies?.[name]
    || pkg.devDependencies?.[name]
    || rootPkg.dependencies?.[name]
    || rootPkg.devDependencies?.[name]
  )
}

const outCode = [await fs.readFile('dist/index.d.ts', 'utf8'), await fs.readFile('dist/index.mjs', 'utf8')].join(
  '\n'
)

const dependencies = {
  ...Object.fromEntries(
    externalDeps
      .filter((dep) => {
        return new RegExp(` from ["']${dep}(["']|[/][^"']+["'])`).test(outCode)
      })
      .map((dep) => {
        return [dep, depVersion(dep)]
      })
  ),

  ...pkg.dependencies,
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

await fs.writeJson(
  upath.joinSafe(distDir, 'package.json'),
  {
    name: `@bemoje/${wsDirname}`,
    version: pkg.version,
    description: pkg.description,
    type: 'module',
    sideEffects: pkg.sideEffects,
    keywords: pkg.keywords,
    exports: { '.': { types: './index.d.ts', import: './index.mjs', default: './index.mjs' } },
    dependencies,
    publishConfig: { access: 'public' },
    license: rootPkg.license,
    author: rootPkg.author,
    repository: { ...rootPkg.repository, directory: `libs/${wsDirname}` },
  },
  { spaces: 2 }
)

console.info(`Built: libs/${wsDirname}`)

process.exit(0)
