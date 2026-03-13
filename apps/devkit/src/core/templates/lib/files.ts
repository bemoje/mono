import { JsonFileTemplateStrategy } from '@mono/template'
import { Template } from '@mono/template'
import { TextFileTemplateStrategy } from '@mono/template'
import { Type } from '@sinclair/typebox'
import fs from 'fs-extra'
import { repoRootPackageJsonPath } from '../../constants/paths'
import { tsconfigBaseJsonBasename } from '../../constants/paths'

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
    description: '',
    keywords: [],
    packageManager: getRepoRootPkg().packageManager,
    type: 'module',
    private: true,
    module: 'src/index.ts',
    sideEffects: false,
    scripts: {
      build: "node --import '../../scripts/build-lib.mjs'",
      npmPublish: 'yarn build && cd dist && npm publish && cd ../../',
    },
    dependencies: {},
    devDependencies: { tsup: '^8.5.1' },
    exports: { '.': './src/index.ts' },
  },
})

const tsup = new Template({
  strategy: new TextFileTemplateStrategy(),
  optionsSchema: Type.Object({}),
  template: [
    `import { defineConfig } from 'tsup'`,
    `import { parseBarrelExportIndexFile } from '../../scripts/parseBarrelExportIndexFile.mjs'`,
    ``,
    `export default defineConfig({`,
    `  entryPoints: parseBarrelExportIndexFile(),`,
    `  bundle: false,`,
    `  platform: 'node',`,
    `  treeshake: 'recommended',`,
    `  shims: true,`,
    `  cjsInterop: true,`,
    `  tsconfig: 'tsconfig.json',`,
    `  target: 'esnext',`,
    `  noExternal: ['type-fest', '@types/*', '@mono/*'],`,
    `  format: ['esm', 'cjs'],`,
    `  dts: 'src/index.ts',`,
    `  dtsResolve: true,`,
    `  outDir: 'dist/lib',`,
    `  removeNodeProtocol: false,`,
    `})`,
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
  template: { extends: `../../${tsconfigBaseJsonBasename}` },
})

const indexTs = new Template({ strategy: new TextFileTemplateStrategy(), template: [''] })

export const files = { packageJson, tsup, readmeMd, tsconfigJson, indexTs }
