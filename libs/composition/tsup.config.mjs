import { defineConfig } from 'tsup'
import fs from 'fs-extra'

const entryPoints = (fs.existsSync('src/index.ts') ? fs.readFileSync('src/index.ts', 'utf8').split('\n') : [])
  .filter((line) => {
    return line.startsWith('export * from ')
  })
  .map((line) => {
    return line
      .split('export * from ')[1]
      .slice(1)
      .replaceAll(/["';]+$/g, '')
  })
  .concat('./index')
  .map((file) => {
    return `${file.replace(/^\./, 'src')}.ts`
  })

export default defineConfig({
  entryPoints,
  bundle: false,
  platform: 'node',
  treeshake: 'recommended',
  shims: true,
  cjsInterop: true,
  tsconfig: 'tsconfig.json',
  target: 'esnext',
  noExternal: ['type-fest', '@types/*', '@mono/*'],
  format: ['esm', 'cjs'],
  dts: 'src/index.ts',
  dtsResolve: true,
  outDir: './dist/lib',
  removeNodeProtocol: false,
})
