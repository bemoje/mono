import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}))

vi.mock('../../core/config/config', () => ({
  dataPath: '/mock/data/path',
  configFile: { filepath: '/mock/config/filepath' },
}))

vi.mock('../../core/templates/templates', () => ({
  templates: {
    commands: {
      openFileInIDE: {
        renderString: vi.fn(() => 'code /mock/config/filepath'),
      },
    },
  },
}))

import { execSync } from 'node:child_process'
import { configPath, configEdit } from './config-commands'

describe('config-commands', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe(configPath.name, () => {
    it('should return a Command instance', () => {
      const cmd = configPath()
      expect(cmd.name()).toBe('path')
    })

    it('should print the data path when action is invoked', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const cmd = configPath()
      cmd.parse([], { from: 'user' })
      expect(consoleSpy).toHaveBeenCalledWith('/mock/data/path')
      consoleSpy.mockRestore()
    })
  })

  describe(configEdit.name, () => {
    it('should return a Command instance', () => {
      const cmd = configEdit()
      expect(cmd.name()).toBe('edit')
    })

    it('should call execSync with the open file command when action is invoked', () => {
      const cmd = configEdit()
      cmd.parse([], { from: 'user' })
      expect(execSync).toHaveBeenCalledWith('code /mock/config/filepath')
    })
  })
})
