import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  bundle: true,
  skipNodeModulesBundle: true,
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
  outDir: 'dist/lib',
  removeNodeProtocol: false,
})
