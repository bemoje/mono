import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  platform: 'node',
  treeshake: 'recommended',
  shims: true,
  cjsInterop: true,
  tsconfig: 'tsconfig.json',
  target: 'esnext',
  noExternal: ['type-fest', '@types/*'],
  format: ['esm'],
  dts: 'src/index.ts',

  outExtension() {
    return {
      js: '.mjs',
    }
  },
})
