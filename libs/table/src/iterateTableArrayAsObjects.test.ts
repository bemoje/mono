import { describe, expect, it } from 'vitest'
import { iterateTableArrayAsObjects } from './iterateTableArrayAsObjects'

describe(iterateTableArrayAsObjects.name, () => {
  const headers = ['name', 'sex', 'age']
  const rows = [
    ['Mark', 'M', '2'],
    ['Anna', 'F', '3'],
  ]

  it('should iterate valid table', async () => {
    const objects = [...iterateTableArrayAsObjects(rows, headers)]
    expect(objects).toEqual([
      { name: 'Mark', sex: 'M', age: '2' },
      { name: 'Anna', sex: 'F', age: '3' },
    ])
  })

  it('should ignore headers based on the ignoreHeaders argument', async () => {
    const ignoreHeaders = new Set(['sex'])
    const objects = [...iterateTableArrayAsObjects(rows, headers, ignoreHeaders)]
    expect(objects).toEqual([
      { name: 'Mark', age: '2' },
      { name: 'Anna', age: '3' },
    ])
  })
})
