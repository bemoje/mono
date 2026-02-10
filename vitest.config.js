// vitest.config.ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getAllWorkspaceTsconfigFilepaths } from './s/util/getAllWorkspaceTsconfigFilepaths.mjs'
import { getRepoRootDirpath } from './s/util/getRepoRootDirpath.mjs'
// @type {import('vitest/config').UserConfig}
export default defineConfig({
  test: {
    isolate: true,
    passWithNoTests: true,
    fileParallelism: 5,
    root: getRepoRootDirpath(),
    include: ['{libs,apps}/*/{src,examples}/**/*.test.ts'],
    exclude: ['apps/playground'],
    reporters: ['dot'],
    coverage: {
      enabled: false,
      reporter: ['html', 'json-summary', 'text-summary'],
      include: ['{libs,apps}/*/src/**/*.ts'],
      exclude: [
        'apps/playground',
        '{libs,apps}/*/{src,examples}/**/*{temp,wip,examples,benchmark}*.ts',
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
