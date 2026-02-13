// vitest.config.ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { globSync } from 'glob'
import upath from 'upath'

function getRepoRoot() {
  const parts = upath.normalizeSafe(import.meta.dirname).split('/')
  const i = parts.findLastIndex((p) => p === 'mono')
  if (i === -1) throw new Error('Could not find repo root directory')
  return parts.slice(0, i + 1).join('/')
}

// @type {import('vitest/config').UserConfig}
export default defineConfig({
  test: {
    isolate: true,
    passWithNoTests: true,
    fileParallelism: 5,
    root: getRepoRoot(),
    include: ['{libs,apps}/*/{src,examples}/**/*.test.ts'],
    exclude: ['apps/playground'],
    reporters: ['dot'],
    coverage: {
      enabled: false,
      reporter: ['html', 'json-summary', 'text-summary'],
      include: ['{libs,apps}/*/src/**/*.ts'],
      exclude: [
        '{libs,apps}/*/{src,examples}/**/*{temp,wip,examples,benchmark}*.ts',
        'apps/playground/**',
        // devkit: CLI command handlers (integration-level, not unit-testable)
        'apps/devkit/src/commands/{build,clean,debug,insight,publish,run,ws}/**',
        'apps/devkit/src/commands/config/config-commands.ts',
        'apps/devkit/src/commands/imports/mostFrequentImportStatements.ts',
        'apps/devkit/src/commands/imports/mostImportedFiles.ts',
        // devkit: main CLI entry point (integration wiring)
        'apps/devkit/src/main.ts',
        // devkit: I/O-heavy or integration-level lib files
        'apps/devkit/src/lib/buildFile.ts',
        'apps/devkit/src/lib/buildLibsWorkspace.ts',
        'apps/devkit/src/lib/buildStats.ts',
        'apps/devkit/src/lib/confirmPrompt.ts',
        'apps/devkit/src/lib/getEmptyWsFiles.ts',
        'apps/devkit/src/lib/getLinesOfCode.ts',
        'apps/devkit/src/lib/importLibs.ts',
        'apps/devkit/src/lib/outputFileIfChanged.ts',
        'apps/devkit/src/lib/renderReadme.ts',
        'apps/devkit/src/lib/timer.ts',
        'apps/devkit/src/lib/workspaces.ts',
        // devkit: trivial single-value exports
        'apps/devkit/src/core/version.ts',
        'apps/devkit/src/core/description.ts',
        'apps/devkit/src/core/templates/templates.ts',
      ],
      reportsDirectory: `.coverage/html`,
    },
  },
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.json', ...globSync('{apps,libs,packages}/*/tsconfig.json').map((dp) => './' + dp)],
    }),
  ],
})
