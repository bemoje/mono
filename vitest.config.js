// vitest.config.ts
import '@vitest/coverage-v8'
import { defineConfig } from 'vitest/config'
import { globSync } from 'glob'
import tsconfigPaths from 'vite-tsconfig-paths'
import upath from 'upath'

function getRepoRoot() {
  const parts = upath.normalizeSafe(import.meta.dirname).split('/')
  const i = parts.findLastIndex((p) => {
    return p === 'mono'
  })
  if (i === -1) {
    throw new Error('Could not find repo root directory')
  }
  return parts.slice(0, i + 1).join('/')
}

// @type {import('vitest/config').UserConfig}
export default defineConfig({
  test: {
    isolate: true,
    passWithNoTests: true,
    fileParallelism: true,
    root: getRepoRoot(),
    include: ['{libs,apps}/*/{src,examples}/**/*.test.ts'],
    exclude: ['apps/playground'],
    reporters: ['dot'],
    coverage: {
      enabled: false,
      reporter: ['html', 'json', 'json-summary', 'text-summary'],
      include: ['{libs,apps}/*/src/**/*.ts'],
      exclude: ['{libs,apps}/*/{src,examples}/**/*{temp,wip,benchmark}*.ts', 'apps/**', 'libs/prompt'],
      reportsDirectory: `.coverage/html`,
    },
  },
  plugins: [
    tsconfigPaths({
      projects: [
        'tsconfig.json',
        ...globSync('{apps,libs,packages}/*/tsconfig.json').map((dp) => {
          return `./${dp}`
        }),
      ],
    }),
  ],
})
