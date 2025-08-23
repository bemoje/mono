// vitest.config.ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getAllWorkspaceTsconfigFilepaths } from './s/util/getAllWorkspaceTsconfigFilepaths.mjs'
import { getRepoRootDirpath } from './s/util/getRepoRootDirpath.mjs'

export default defineConfig({
  test: {
    isolate: true,
    passWithNoTests: true,
    root: getRepoRootDirpath(),
    include: ['{libs,packages,apps}/*/src/**/*.test.ts'],
    exclude: ['**/{temp,wip}/**/*', 'apps/playground'],
    reporters: ['dot', 'hanging-process'],
    coverage: {
      enabled: false,
      reporter: ['html', 'json-summary', 'text-summary'],
      include: ['{libs,packages}/*/src/**/*.ts'],
      exclude: ['apps/playground', 'libs/types', 'libs/monorepo', '**/*.{temp,wip,examples,benchmark}.*'],
      reportsDirectory: `.coverage/html`,
    },
  },
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.json', ...getAllWorkspaceTsconfigFilepaths()],
    }),
  ],
})
