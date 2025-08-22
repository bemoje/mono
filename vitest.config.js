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
    exclude: ['libs/types', 'apps/playground', '**/*.{wip,examples,example,temp,benchmark}.*', '**/{temp,wip}/*'],
    reporters: ['dot', 'hanging-process'],
    coverage: {
      enabled: false,
      reporter: ['html', 'json-summary'],
      include: ['{libs,packages}/*/src/**/*.ts'],
      exclude: [
        'apps',
        'libs/types',
        'libs/monorepo',
        '**/*.{wip,examples,example,temp,benchmark}.*',
        '**/{temp,wip}/*',
      ],
      reportsDirectory: `.coverage/html`,
    },
  },
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.json', ...getAllWorkspaceTsconfigFilepaths()],
    }),
  ],
})
