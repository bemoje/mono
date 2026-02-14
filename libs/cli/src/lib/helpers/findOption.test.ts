import { describe, expect, it } from 'vitest'
import { findOption } from './findOption'
import type { ICommand, IOption } from '../types'

function mockOption(overrides: Partial<IOption> = {}): IOption {
  return { name: 'verbose', short: 'v', long: 'verbose', ...overrides } as IOption
}

function mockCmd(options: IOption[] = []): ICommand {
  return { options } as unknown as ICommand
}

describe(findOption.name, () => {
  it('should find option by name', () => {
    const opt = mockOption()
    expect(findOption(mockCmd([opt]), 'verbose')).toBe(opt)
  })

  it('should find option by short name', () => {
    const opt = mockOption()
    expect(findOption(mockCmd([opt]), 'v')).toBe(opt)
  })

  it('should find option by long name', () => {
    const opt = mockOption({ name: 'verb', long: 'verbose' })
    expect(findOption(mockCmd([opt]), 'verbose')).toBe(opt)
  })

  it('should return undefined if option is not found', () => {
    expect(findOption(mockCmd([mockOption()]), 'nonexistent')).toBeUndefined()
  })

  it('should return undefined if command has no options', () => {
    expect(findOption(mockCmd(), 'verbose')).toBeUndefined()
  })
})
