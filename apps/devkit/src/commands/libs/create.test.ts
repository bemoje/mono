import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('fs-extra', () => ({
  default: {
    readJsonSync: vi.fn(() => ({
      name: 'mono',
      packageManager: 'yarn@4.3.1',
      devDependencies: { eslint: '^9.0.0' },
    })),
    mkdirSync: vi.fn(),
    outputFileSync: vi.fn(),
    outputJsonSync: vi.fn(),
  },
}))

vi.mock('upath', () => ({
  default: {
    normalize: vi.fn((p: string) => p.replace(/\\/g, '/')),
    join: vi.fn((...args: string[]) => args.join('/')),
  },
}))

vi.mock('../common/cliExec', () => ({
  cliExecSync: vi.fn(),
}))

vi.mock('../../core/constants/paths', () => ({
  repoRootPackageJsonPath: '/repo/package.json',
  tsconfigBasePathsJsonPath: '/repo/tsconfig.paths.json',
}))

vi.mock('../../core/templates/templates', () => ({
  templates: {
    files: {
      eslintConfigJs: { renderString: vi.fn(() => 'eslint config content') },
      packageJson: { renderString: vi.fn(() => '{"name":"test"}') },
      esbuild: { renderString: vi.fn(() => 'esbuild content') },
      readmeMd: { renderString: vi.fn(() => '# test') },
      tsconfigJson: { renderString: vi.fn(() => '{"extends":"../../tsconfig.json"}') },
      indexTs: { renderString: vi.fn(() => '') },
    },
  },
}))

import fs from 'fs-extra'
import { cliExecSync } from '../common/cliExec'
import { createLib } from './create'

describe(createLib.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fs.readJsonSync).mockReturnValue({
      name: 'mono',
      packageManager: 'yarn@4.3.1',
      devDependencies: { eslint: '^9.0.0' },
      compilerOptions: { paths: {} },
    })
  })

  it('should return a Command named "create"', () => {
    const cmd = createLib()
    expect(cmd.name()).toBe('create')
  })

  it('should create library files and directories when action is invoked', () => {
    const cmd = createLib()
    cmd.parse(['my-lib'], { from: 'user' })

    expect(fs.mkdirSync).toHaveBeenCalled()
    expect(fs.outputFileSync).toHaveBeenCalled()
    expect(fs.outputJsonSync).toHaveBeenCalled()
    expect(cliExecSync).toHaveBeenCalledTimes(2)
  })

  it('should pass options through to cliExecSync', () => {
    const cmd = createLib()
    cmd.parse(['my-lib', '--dryRun'], { from: 'user' })

    expect(vi.mocked(cliExecSync).mock.calls[0][1]).toHaveProperty('dryRun', true)
  })
})
