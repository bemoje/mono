import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { findOption } from './findOption'
import type { ICommand } from "../types";
import type { Option } from "../types";

function mockOption(overrides: Partial<Option> = {}): Option {
  return { name: 'verbose', short: 'v', long: 'verbose', ...overrides } as Option
}

function mockCmd(options: Option[] = []): ICommand {
  return { options } as unknown as ICommand
}

describe(findOption.name, () => {
  it('should find option by name', () => {
    const opt = mockOption({ name: 'verbose' })
    expect(findOption(mockCmd([opt]), 'verbose')).toBe(opt)
  })

  it('should find option by short flag', () => {
    const opt = mockOption({ short: 'v' })
    expect(findOption(mockCmd([opt]), '-v')).toBe(opt)
  })

  it('should find option by long flag', () => {
    const opt = mockOption({ long: 'verbose' })
    expect(findOption(mockCmd([opt]), '--verbose')).toBe(opt)
  })

  it('should return undefined when no options exist', () => {
    expect(findOption(mockCmd(), 'verbose')).toBeUndefined()
  })

  it('should return undefined when option is not found by name', () => {
    expect(findOption(mockCmd([mockOption()]), 'debug')).toBeUndefined()
  })

  it('should return undefined when option is not found by short flag', () => {
    expect(findOption(mockCmd([mockOption()]), '-d')).toBeUndefined()
  })

  it('should return undefined when option is not found by long flag', () => {
    expect(findOption(mockCmd([mockOption()]), '--debug')).toBeUndefined()
  })

  it('should find among multiple options', () => {
    const verbose = mockOption({ name: 'verbose', short: 'v', long: 'verbose' })
    const debug = mockOption({ name: 'debug', short: 'd', long: 'debug' })
    const cmd = mockCmd([verbose, debug])
    expect(findOption(cmd, 'debug')).toBe(debug)
    expect(findOption(cmd, '-d')).toBe(debug)
    expect(findOption(cmd, '--debug')).toBe(debug)
    expect(findOption(cmd, 'verbose')).toBe(verbose)
    expect(findOption(cmd, '-v')).toBe(verbose)
    expect(findOption(cmd, '--verbose')).toBe(verbose)
  })

  it('should not confuse single dash with double dash', () => {
    const opt = mockOption({ short: 'v', long: 'verbose' })
    const cmd = mockCmd([opt])
    expect(findOption(cmd, '-verbose')).toBeUndefined()
    expect(findOption(cmd, '--v')).toBeUndefined()
  })

  it('should match by name without dashes', () => {
    const opt = mockOption({ name: 'output', short: 'o', long: 'output' })
    const cmd = mockCmd([opt])
    expect(findOption(cmd, 'output')).toBe(opt)
  })
})
