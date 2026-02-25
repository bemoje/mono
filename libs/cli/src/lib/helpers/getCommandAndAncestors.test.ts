import type { ICommand } from '../types'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { getCommandAndAncestors } from './getCommandAndAncestors'
import { it } from 'vitest'

function mockCmd(name: string, parent?: ICommand): ICommand {
  return { name, parent } as unknown as ICommand
}

describe(getCommandAndAncestors.name, () => {
  it('should return only the command itself when there is no parent', () => {
    const cmd = mockCmd('root')
    expect(getCommandAndAncestors(cmd)).toEqual([cmd])
  })

  it('should return command and its parent', () => {
    const root = mockCmd('root')
    const child = mockCmd('child', root)
    expect(getCommandAndAncestors(child)).toEqual([child, root])
  })

  it('should return full ancestor chain in order', () => {
    const root = mockCmd('root')
    const mid = mockCmd('mid', root)
    const leaf = mockCmd('leaf', mid)
    expect(getCommandAndAncestors(leaf)).toEqual([leaf, mid, root])
  })
})
