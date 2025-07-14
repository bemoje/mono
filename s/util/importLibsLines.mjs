import upath from 'upath'
import { getAllImports, MonoRepo } from '../../.dist/monorepo.cjs'
import { DefaultMap } from 'mnemonist'
import { importLibs } from './importLibs.mjs'

const lines = new Set()
const namespaceImportLines = new Set()

const modules = await importLibs()
// import pkg from '../../package.json' assert { type: 'json' }

// const deps = (await fs.readJson('package.json')).dependencies
// for (const key of Object.keys(deps)) {
//   const mod = await import(key)
//   modules.set(key, mod)
// }

modules.forEach((mod, name) => {
  namespaceImportLines.add(`import * as ${'_' + name.replace(/-/g, '_')} from '@mono/${name}';`)
  const namedExports = Object.keys(mod).filter((key) => key !== 'default')
  if (namedExports.length === 0) return
  const line = `import { ${namedExports.join(', ')} } from '@mono/${name}';`
  lines.add(line)
})

const extImps = new DefaultMap(() => new Set())
const regexIgnoreTsFile = /[./](spec|test|example|examples|bench|temp)[./]/
const repo = new MonoRepo()
getAllImports(repo)
  .filter((imp) => !regexIgnoreTsFile.test(upath.normalizeSafe(imp.parent.parent.path)))
  .filter((imp) => imp.module.isBuiltin || imp.module.isExternal)
  .forEach((imp) => {
    imp.specifiers?.namedImportsArray?.forEach((name) => {
      extImps.get(imp.module.from).add(name)
    })
  })

extImps.forEach((set, name) => {
  if (!name.includes('/')) {
    namespaceImportLines.add(`// import * as ${name.replace(/-/g, '_')} from '${name}';`)
  }
  const namedExports = Array.from(set).sort()
  const line = `// import { ${namedExports.join(', ')} } from '${name}';`
  lines.add(line)
})

console.log([...lines, '', ...namespaceImportLines].join('\n'))
