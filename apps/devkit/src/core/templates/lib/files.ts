import { JsonFileTemplateStrategy, Template, TextFileTemplateStrategy } from '@mono/template'
import { Type } from '@sinclair/typebox'
import { repoRootPackageJsonPath, tsconfigBaseJsonBasename } from '../../constants/paths'

const eslintConfigJs = new Template({
  strategy: new TextFileTemplateStrategy(),
  template: [
    "import eslintConfig from '../../eslint.config.js'", //
    'export default [...eslintConfig]',
    '',
  ],
})

import fs from 'fs-extra'

const packageJson = new Template({
  strategy: new JsonFileTemplateStrategy(),
  optionsSchema: Type.Object({ libraryName: Type.String() }),
  template: {
    name: '{{libraryName}}',
    version: '0.0.1',
    packageManager: fs.readJsonSync(repoRootPackageJsonPath).packageManager,
    type: 'module',
    private: true,
    module: 'src/index.ts',
    sideEffects: false,
    scripts: {
      lint: 'yarn eslint . --fix',
      indexts: 'node ../../s/indexts.mjs',
      build: 'node esbuild.mjs',
    },
    devDependencies: {
      eslint: fs.readJsonSync(repoRootPackageJsonPath).devDependencies.eslint,
    },
  },
})

const esbuild = new Template({
  strategy: new TextFileTemplateStrategy(),
  optionsSchema: Type.Object({}),
  template: [
    `import { buildLibsWorkspace } from '../../s/util/buildLibsWorkspace.mjs'`,
    ``,
    `await buildLibsWorkspace(import.meta.dirname, { debug: false })`,
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
