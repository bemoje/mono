import { describe, expect, it } from 'vitest'
import { assertOptionLongNotInUse } from './assertOptionLongNotInUse'
import type { ICommand } from '../types'

function mockCmd(options: Partial<{ long: string }>[] = []): ICommand {
  return { options } as unknown as ICommand
}

describe(assertOptionLongNotInUse.name, () => {
  it('should throw if option long name is already in use', () => {
    expect(() => assertOptionLongNotInUse(mockCmd([{ long: 'verbose' }]), 'verbose')).toThrow(
      'Option long name already in use: --verbose',
    )
  })

  it('should not throw if option long name is unique', () => {
    expect(() => assertOptionLongNotInUse(mockCmd([{ long: 'verbose' }]), 'debug')).not.toThrow()
  })

  it('should not throw if command has no options', () => {
    expect(() => assertOptionLongNotInUse(mockCmd(), 'verbose')).not.toThrow()
  })
})
