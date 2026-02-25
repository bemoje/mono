import type { ICommand } from '../types'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { getCommandAncestors } from './getCommandAncestors'
import { it } from 'vitest'

function mockCmd(name: string, parent?: ICommand): ICommand {
  return { name, parent } as unknown as ICommand
}

describe(getCommandAncestors.name, () => {
  it('should return empty array when there is no parent', () => {
    const cmd = mockCmd('root')
    expect(getCommandAncestors(cmd)).toEqual([])
  })

  it('should return only the parent, excluding the command itself', () => {
    const root = mockCmd('root')
    const child = mockCmd('child', root)
    expect(getCommandAncestors(child)).toEqual([root])
  })

  it('should return all ancestors excluding the command itself', () => {
    const root = mockCmd('root')
    const mid = mockCmd('mid', root)
    const leaf = mockCmd('leaf', mid)
    expect(getCommandAncestors(leaf)).toEqual([mid, root])
  })
})
