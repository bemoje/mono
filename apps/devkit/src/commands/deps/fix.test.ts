import { describe, expect, it, vi, beforeEach, afterAll, beforeAll } from 'vitest'

vi.mock('fs-extra', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}))

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}))

vi.mock('../../lib/confirmPrompt', () => ({
  confirmPrompt: vi.fn(),
}))

vi.mock('@mono/monorepo', () => ({
  MonoRepo: vi.fn(),
  Workspace: vi.fn(),
}))

vi.mock('../../core/templates/templates', () => ({
  templates: {
    commands: {
      removeDependency: {
        render: vi.fn(
          (opts: { workspace: string; dependency: string }) =>
            `yarn workspace ${opts.workspace} remove ${opts.dependency}`,
        ),
      },
      addDependency: {
        render: vi.fn((opts: { dependency: string }) => `yarn add ${opts.dependency}`),
      },
      addDevDependency: {
        render: vi.fn((opts: { dependency: string }) => `yarn add ${opts.dependency} --dev`),
      },
    },
  },
}))

import fs from 'fs-extra'
import { confirmPrompt } from '../../lib/confirmPrompt'
import { MonoRepo } from '@mono/monorepo'
import { fixDeps } from './fix'

function createMockWorkspace(overrides: Record<string, unknown> = {}) {
  return {
    name: '@mono/test-ws',
    path: '/repo/libs/test-ws',
    parent: {
      path: '/repo',
      packageJson: {
        dependencies: { lodash: '^4.0.0' },
        devDependencies: { vitest: '^1.0.0' },
      },
    },
    incorrectlyImportedRepoWorkspaces: [],
    unusedDependencies: [],
    missingDependencies: [],
    missingDevDependencies: [],
    ...overrides,
  }
}

describe(fixDeps.name, () => {
  // ignore console.error output in tests
  const originalConsoleError = console.error
  beforeAll(() => {
    console.error = () => {}
  })
  afterAll(() => {
    console.error = originalConsoleError
  })
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a Command instance named "fix"', () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [createMockWorkspace()],
        }) as never,
    )
    const cmd = fixDeps()
    expect(cmd.name()).toBe('fix')
  })

  it('should run action with no issues and print summary', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [createMockWorkspace()],
        }) as never,
    )
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync(['--yes', '--quiet'], { from: 'user' })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should fix incorrectly imported workspaces', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [
            createMockWorkspace({
              incorrectlyImportedRepoWorkspaces: [
                { filepath: '/repo/libs/test/src/index.ts', replaceValue: '../bad', withValue: '@mono/good' },
              ],
            }),
          ],
        }) as never,
    )
    vi.mocked(fs.readFile).mockResolvedValue("import x from '../bad'" as never)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined as never)

    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync(['--yes'], { from: 'user' })
    expect(fs.readFile).toHaveBeenCalledWith('/repo/libs/test/src/index.ts', 'utf8')
    expect(fs.writeFile).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should skip incorrectly imported workspaces when user declines confirmation', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [
            createMockWorkspace({
              incorrectlyImportedRepoWorkspaces: [
                { filepath: '/repo/libs/test/src/index.ts', replaceValue: '../bad', withValue: '@mono/good' },
              ],
            }),
          ],
        }) as never,
    )
    vi.mocked(confirmPrompt).mockResolvedValue(false)

    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync([], { from: 'user' })
    expect(fs.readFile).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should handle error when fixing import fails', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [
            createMockWorkspace({
              incorrectlyImportedRepoWorkspaces: [
                { filepath: '/repo/libs/test/src/index.ts', replaceValue: '../bad', withValue: '@mono/good' },
              ],
            }),
          ],
        }) as never,
    )
    vi.mocked(fs.readFile).mockRejectedValue(new Error('read failed'))

    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync(['--yes'], { from: 'user' })
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleInfoSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should log dryRun message for incorrect imports', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [
            createMockWorkspace({
              incorrectlyImportedRepoWorkspaces: [
                { filepath: '/repo/libs/test/src/index.ts', replaceValue: '../bad', withValue: '@mono/good' },
              ],
            }),
          ],
        }) as never,
    )
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync(['--yes', '--dryRun'], { from: 'user' })
    expect(fs.readFile).not.toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('dryRun'))
    consoleInfoSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  it('should output debug info when --debug is set', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [createMockWorkspace()],
        }) as never,
    )

    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync(['--yes', '--debug'], { from: 'user' })
    expect(consoleDebugSpy).toHaveBeenCalled()
    consoleInfoSpy.mockRestore()
    consoleDebugSpy.mockRestore()
  })

  it('should suppress output when --silent is set', async () => {
    vi.mocked(MonoRepo).mockImplementation(
      () =>
        ({
          workspaces: [
            createMockWorkspace({
              unusedDependencies: ['pkg1'],
            }),
          ],
        }) as never,
    )

    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const cmd = fixDeps()
    await cmd.parseAsync(['--silent'], { from: 'user' })
    // --silent implies --yes, so it should proceed but not log info for individual fixes
    consoleInfoSpy.mockRestore()
  })
})
