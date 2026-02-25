import { Command } from './Command'
import assert from 'node:assert'
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

  it('examples', () => {
    expect(() => {
      // Basic command setup
      const cmd = new Command('myapp')
        .setDescription('A test application')
        .setVersion('1.0.0')
        .addArgument('<input>')
        .addArgument('[output]', { defaultValue: 'out.txt' })
        .addOption('-v, --verbose', { description: 'verbose output' })
        .addOption('-f, --format <type>', { description: 'output format' })

      assert.deepStrictEqual(cmd.name, 'myapp')
      assert.deepStrictEqual(cmd.version, '1.0.0')
      assert.deepStrictEqual(cmd.description, 'A test application')

      // Test parsing
      const result = cmd.parseArgv(['input.txt', '-v', '-f', 'json'])
      assert.deepStrictEqual(result.args, ['input.txt', 'out.txt'])
      assert.deepStrictEqual(result.opts.verbose, true)
      assert.deepStrictEqual(result.opts.format, 'json')

      // Variadic arguments
      const cmd2 = new Command('myapp2')
        .addArgument('<files...>')
        .addOption('-o, --output [dir]', { description: 'output directory', defaultValue: 'dist' })

      const result2 = cmd2.parseArgv(['file1.txt', 'file2.txt', 'file3.txt'])
      assert.deepStrictEqual(result2.args, [['file1.txt', 'file2.txt', 'file3.txt']])
      assert.deepStrictEqual(result2.opts.output, 'dist')

      // Variadic options
      const cmd3 = new Command('myapp3')
        .addArgument('<input>')
        .addOption('-i, --include <patterns...>', { description: 'include patterns' })
        .addOption('-e, --exclude [patterns...]', {
          description: 'exclude patterns',
          defaultValue: ['node_modules'],
        })

      const result3 = cmd3.parseArgv(['input.txt', '-i', 'src', 'lib', '-e', 'test'])
      assert.deepStrictEqual(result3.args, ['input.txt'])
      assert.deepStrictEqual(result3.opts.include, ['src', 'lib'])
      assert.deepStrictEqual(result3.opts.exclude, ['test'])
    }).not.toThrow()
  })
})
