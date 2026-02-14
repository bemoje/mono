import { describe, expect, it } from 'vitest'
import { assertOptionNameNotInUse } from './assertOptionNameNotInUse'
import type { ICommand } from '../types'

function mockCmd(options: Partial<{ name: string }>[] = []): ICommand {
  return { options } as unknown as ICommand
}

describe(assertOptionNameNotInUse.name, () => {
  it('should throw if option name is already in use', () => {
    expect(() => assertOptionNameNotInUse(mockCmd([{ name: 'verbose' }]), 'verbose')).toThrow(
      'Option name already in use: --verbose',
    )
  })

  it('should not throw if option name is unique', () => {
    expect(() => assertOptionNameNotInUse(mockCmd([{ name: 'verbose' }]), 'debug')).not.toThrow()
  })

  it('should not throw if command has no options', () => {
    expect(() => assertOptionNameNotInUse(mockCmd(), 'verbose')).not.toThrow()
  })
})
