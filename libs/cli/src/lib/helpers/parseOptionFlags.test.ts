import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { parseOptionFlags } from './parseOptionFlags'

describe(parseOptionFlags.name, () => {
  it('should parse a boolean flag', () => {
    const result = parseOptionFlags('-v, --verbose')
    expect(result).toEqual({ short: 'v', long: 'verbose', name: 'verbose', argName: undefined })
  })

  it('should parse a required string option', () => {
    const result = parseOptionFlags('-f, --file <path>')
    expect(result).toEqual({ short: 'f', long: 'file', name: 'file', argName: 'path' })
  })

  it('should parse an optional string option', () => {
    const result = parseOptionFlags('-o, --output [path]')
    expect(result).toEqual({ short: 'o', long: 'output', name: 'output', argName: 'path' })
  })

  it('should parse a required variadic option', () => {
    const result = parseOptionFlags('-i, --include <patterns...>')
    expect(result).toEqual({ short: 'i', long: 'include', name: 'include', argName: 'patterns' })
  })

  it('should parse an optional variadic option', () => {
    const result = parseOptionFlags('-e, --exclude [patterns...]')
    expect(result).toEqual({ short: 'e', long: 'exclude', name: 'exclude', argName: 'patterns' })
  })

  it('should camelCase hyphenated long names', () => {
    const result = parseOptionFlags('-n, --no-color')
    expect(result).toEqual({ short: 'n', long: 'no-color', name: 'noColor', argName: undefined })
  })

  it('should camelCase multi-hyphenated long names', () => {
    const result = parseOptionFlags('-s, --some-long-name <val>')
    expect(result).toEqual({ short: 's', long: 'some-long-name', name: 'someLongName', argName: 'val' })
  })

  it('should throw for invalid option format', () => {
    expect(() => parseOptionFlags('--verbose' as never)).toThrow('Invalid option format')
    expect(() => parseOptionFlags('invalid' as never)).toThrow('Invalid option format')
  })
})
