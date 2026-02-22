import { JsonFileTemplateStrategy, Template, TextFileTemplateStrategy } from '@mono/template'
import { Type } from '@sinclair/typebox'
import { repoRootPackageJsonPath, tsconfigBaseJsonBasename } from '../../constants/paths'
import fs from 'fs-extra'

const eslintConfigJs = new Template({
  strategy: new TextFileTemplateStrategy(),
  template: [
    "import eslintConfig from '../../eslint.config.mjs'", //
    'export default [...eslintConfig]',
    '',
  ],
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _repoRootPkg: any
function getRepoRootPkg() {
  if (!_repoRootPkg) {
    try {
      _repoRootPkg = fs.readJsonSync(repoRootPackageJsonPath)
    } catch {
      // Gracefully handle missing package.json (e.g. running via npx outside repo)
      _repoRootPkg = {}
    }
  }
  return _repoRootPkg
}

const packageJson = new Template({
  strategy: new JsonFileTemplateStrategy(),
  optionsSchema: Type.Object({ libraryName: Type.String() }),
  template: {
    name: '{{libraryName}}',
    version: '0.0.1',
    packageManager: getRepoRootPkg().packageManager,
    type: 'module',
    private: true,
    module: 'src/index.ts',
    sideEffects: false,
    scripts: {
      indexts: 'devkit fix-index-ts',
      build: 'node esbuild.mjs',
    },
    devDependencies: {
      eslint: getRepoRootPkg().devDependencies?.eslint,
    },
  },
})

const esbuild = new Template({
  strategy: new TextFileTemplateStrategy(),
  optionsSchema: Type.Object({}),
  template: [
    `import { execSync } from 'node:child_process'`,
    `import upath from 'upath'`,
    ``,
    `const dirname = upath.basename(import.meta.dirname)`,
    "execSync(`npx @bemoje/devkit build lib ${dirname}`, { stdio: 'inherit' })",
    ``,
  ],
})

const readmeMd = new Template({
  strategy: new TextFileTemplateStrategy(),
  optionsSchema: Type.Object({ libraryName: Type.String() }),
  template: ['# {{libraryName}}', ''],
})

const tsconfigJson = new Template({
  strategy: new JsonFileTemplateStrategy(),
  template: { extends: '../../' + tsconfigBaseJsonBasename },
})

const indexTs = new Template({ strategy: new TextFileTemplateStrategy(), template: [''] })

export const files = { eslintConfigJs, packageJson, esbuild, readmeMd, tsconfigJson, indexTs }
