import { Command } from './Command'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

describe(Command.name, () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe(Command.prototype.renderHelp.name, () => {
    it('should render basic help with command info', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')

      const help = cmd.renderHelp()

      expect(help).toContain('myapp')
    })

    it('should strip ANSI colors when noColor is true', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')

      const colorHelp = cmd.renderHelp()
      const plainHelp = cmd.renderHelp({ noColor: true })

      expect(plainHelp).not.toContain('\x1b[')
      expect(plainHelp.length).toBeLessThanOrEqual(colorHelp.length)
    })

    it('should render help with arguments and options', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')
      cmd
        .addArgument('<input>')
        .addArgument('[output]', { defaultValue: 'out.txt' })
        .addOption('-v, --verbose', { description: 'verbose output' })
        .addOption('-f, --format <type>', { description: 'output format' })

      const help = cmd.renderHelp()

      expect(help).toContain('<input>')
      expect(help).toContain('[output]')
      expect(help).toContain('-v, --verbose')
      expect(help).toContain('-f, --format')
    })

    it('should render help with subcommands', () => {
      const parent = new Command('myapp')
      parent.setVersion('1.0.0')
      parent.command('build')
      parent.command('test')

      const help = parent.renderHelp()

      expect(help).toContain('build')
      expect(help).toContain('test')
    })

    it('should render help with variadic arguments and options', () => {
      const cmd = new Command('myapp')
      cmd
        .addArgument('<files...>')
        .addOption('-i, --include <patterns...>', { description: 'include patterns' })
        .addOption('-e, --exclude [patterns...]', { description: 'exclude patterns' })

      const help = cmd.renderHelp()

      expect(help).toContain('<files...>')
      expect(help).toContain('<patterns...>')
      expect(help).toContain('[patterns...]')
    })

    it('should render help with complex command structure', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')
      cmd.setSummary('A test application')
      cmd.setDescription('This is a test application', 'with multiple lines of description')
      cmd.setGroup('tools')
      cmd
        .addOption('-v, --verbose', { description: 'verbose output' })
        .addOption('-f, --format <type>', { description: 'output format', choices: ['json', 'xml'] })
        .addOption('-o, --output [path]', { description: 'output path', defaultValue: 'dist' })

      const build = cmd.command('build')
      build.setSummary('Build the project')
      build.addArgument('<source>')

      const help = cmd.renderHelp()

      expect(help).toContain('myapp')
      expect(help).toContain('This is a test application') // The summary might not be in the help if description is present
      expect(help).toContain('build')
    })
  })

  describe(Command.prototype.helpConfiguration.name, () => {
    it('should invoke the callback with the Help instance', () => {
      const cmd = new Command('test')
      let helpInstance: unknown = null
      cmd.helpConfiguration((help) => {
        helpInstance = help
      })
      // @ts-expect-error
      expect(helpInstance).toBe(cmd.help)
    })

    it('should return this for chaining', () => {
      const cmd = new Command('test')
      const result = cmd.helpConfiguration(() => {})
      expect(result).toBe(cmd)
    })

    it('should handle helpConfiguration without callback', () => {
      const cmd = new Command('test')
      const result = cmd.helpConfiguration()
      expect(result).toBe(cmd)
    })
  })
})
