import { describe, expect, it } from 'vitest'
import { help_option_enabled_by_default } from './cli.examples'

describe('help', () => {
  it('examples ', () => {
    expect(help_option_enabled_by_default).not.toThrow()
    // expect(subcommands).not.toThrow()
  })
})
