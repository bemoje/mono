import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { help_option_enabled_by_default, subcommands } from './cli.examples'

describe('help', () => {
  // ignore console.log output in tests
  const originalConsoleLog = console.log
  beforeAll(() => {
    console.log = () => {}
  })
  afterAll(() => {
    console.log = originalConsoleLog
  })

  it('examples ', () => {
    expect(help_option_enabled_by_default).not.toThrow()
    expect(subcommands).not.toThrow()
  })
})
