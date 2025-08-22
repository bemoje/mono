/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, it, vi, Mock, expect } from 'vitest'

// Mock the commander module
vi.mock('commander', () => ({ Command: vi.fn() }))

// Mock the command modules
vi.mock('./commands/config/config-commands', () => ({ configEdit: vi.fn(), configPath: vi.fn() }))

vi.mock('./commands/libs/create', () => ({ createLib: vi.fn() }))

vi.mock('./commands/deps/fix', () => ({ fixDeps: vi.fn() }))

vi.mock('./commands/imports/insertImports', () => ({ insertImports: vi.fn() }))
vi.mock('./commands/imports/mostFrequentImportStatements', () => ({ mostFrequentImportStatements: vi.fn() }))
vi.mock('./commands/imports/mostImportedFiles', () => ({ mostImportedFiles: vi.fn() }))

import { Command } from 'commander'
import * as configCommands from './commands/config/config-commands'
import * as createLibModule from './commands/libs/create'
import * as fixDepsModule from './commands/deps/fix'
import * as insertImportsModule from './commands/imports/insertImports'
import * as mostFrequentImportStatementsModule from './commands/imports/mostFrequentImportStatements'
import * as mostImportedFilesModule from './commands/imports/mostImportedFiles'

describe('main', () => {
  let commandInstance: {
    addCommand: Mock
    parseAsync: Mock
    catch: Mock
    alias: Mock
    version: Mock
    description: Mock
  }

  beforeEach(() => {
    commandInstance = {
      addCommand: vi.fn().mockReturnThis(),
      parseAsync: vi.fn().mockReturnThis(),
      catch: vi.fn().mockReturnThis(),
      alias: vi.fn().mockReturnThis(),
      version: vi.fn().mockReturnThis(),
      description: vi.fn().mockReturnThis(),
    }

    vi.mocked(Command).mockImplementation(() => commandInstance as never)

    vi.mocked(configCommands.configEdit).mockReturnValue({} as never)
    vi.mocked(configCommands.configPath).mockReturnValue({} as never)
    vi.mocked(createLibModule.createLib).mockReturnValue({} as never)
    vi.mocked(fixDepsModule.fixDeps).mockReturnValue({} as never)
    vi.mocked(insertImportsModule.insertImports).mockReturnValue({} as never)
    vi.mocked(mostFrequentImportStatementsModule.mostFrequentImportStatements).mockReturnValue({} as never)
    vi.mocked(mostImportedFilesModule.mostImportedFiles).mockReturnValue({} as never)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('Command initialization', () => {
    it('should initialize the main "devkit" command', async () => {
      await import('./main')

      expect(Command).toHaveBeenCalledWith('devkit')
      expect(Command).toHaveBeenCalledWith('libs')
      expect(Command).toHaveBeenCalledWith('deps')
      expect(Command).toHaveBeenCalledWith('config')
    })

    it('should add the "libs" command with createLib', async () => {
      await import('./main')

      expect(createLibModule.createLib).toHaveBeenCalled()
      expect(commandInstance.addCommand).toHaveBeenCalled()
    })

    it('should add the "deps" command with fixDeps', async () => {
      await import('./main')

      expect(fixDepsModule.fixDeps).toHaveBeenCalled()
      expect(commandInstance.addCommand).toHaveBeenCalled()
    })

    it('should add the "config" command with configPath and configEdit', async () => {
      await import('./main')

      expect(configCommands.configPath).toHaveBeenCalled()
      expect(configCommands.configEdit).toHaveBeenCalled()
      expect(commandInstance.addCommand).toHaveBeenCalled()
    })

    it('should add the insertImports command', async () => {
      await import('./main')

      expect(insertImportsModule.insertImports).toHaveBeenCalled()
      expect(commandInstance.addCommand).toHaveBeenCalled()
    })

    it('should call parseAsync and handle errors with catch', async () => {
      await import('./main')

      expect(commandInstance.parseAsync).toHaveBeenCalled()
      expect(commandInstance.catch).toHaveBeenCalled()
      expect(commandInstance.catch).toHaveBeenCalledWith(console.error)
    })
  })

  describe('Edge cases', () => {
    it('should handle errors thrown during parseAsync', async () => {
      const testError = new Error('Test error')
      commandInstance.parseAsync.mockRejectedValueOnce(testError)
      commandInstance.catch.mockImplementation((handler) => {
        handler(testError)
        return commandInstance
      })

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await import('./main')

      expect(consoleErrorSpy).toHaveBeenCalledWith(testError)
      consoleErrorSpy.mockRestore()
    })

    it('should not fail if a command returns undefined', async () => {
      vi.mocked(configCommands.configEdit).mockReturnValue(undefined as never)
      vi.mocked(configCommands.configPath).mockReturnValue(undefined as never)
      vi.mocked(createLibModule.createLib).mockReturnValue(undefined as never)
      vi.mocked(fixDepsModule.fixDeps).mockReturnValue(undefined as never)
      vi.mocked(insertImportsModule.insertImports).mockReturnValue(undefined as never)

      expect(() => import('./main')).not.toThrow()
    })
  })
})
