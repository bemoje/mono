import { describe, expect, it } from 'vitest'
import { assertOptionShortNameNotInUse } from './assertOptionShortNameNotInUse'
import type { ICommand } from '../types'

function mockCmd(options: Partial<{ short: string }>[] = []): ICommand {
  return { options } as unknown as ICommand
}

describe(assertOptionShortNameNotInUse.name, () => {
  it('should throw if option short name is already in use', () => {
    expect(() => assertOptionShortNameNotInUse(mockCmd([{ short: 'v' }]), 'v')).toThrow(
      'Option short name already in use: -v',
    )
  })

  it('should not throw if option short name is unique', () => {
    expect(() => assertOptionShortNameNotInUse(mockCmd([{ short: 'v' }]), 'd')).not.toThrow()
  })

  it('should not throw if command has no options', () => {
    expect(() => assertOptionShortNameNotInUse(mockCmd(), 'v')).not.toThrow()
  })
})
