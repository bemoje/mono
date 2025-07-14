import { describe, expect, it } from 'vitest'
import { arrTableIterateAsObjects } from './arrTableIterateAsObjects'

describe(arrTableIterateAsObjects.name, () => {
  const headers = ['name', 'sex', 'age']
  const rows = [
    ['Mark', 'M', '2'],
    ['Anna', 'F', '3'],
  ]

  it('should iterate valid table', async () => {
    const objects = [...arrTableIterateAsObjects(rows, headers)]
    expect(objects).toEqual([
      { name: 'Mark', sex: 'M', age: '2' },
      { name: 'Anna', sex: 'F', age: '3' },
    ])
  })

  it('should ignore headers based on the ignoreHeaders argument', async () => {
    const ignoreHeaders = new Set(['sex'])
    const objects = [...arrTableIterateAsObjects(rows, headers, ignoreHeaders)]
    expect(objects).toEqual([
      { name: 'Mark', age: '2' },
      { name: 'Anna', age: '3' },
    ])
  })

  it('should throw if ignoreHeaders contains a non-existent header', async () => {
    const ignoreHeaders = new Set(['nonexistent'])
    expect(() => [...arrTableIterateAsObjects(rows, headers, ignoreHeaders)]).toThrow()
  })

  it('should throw if headers is empty', async () => {
    expect(() => [...arrTableIterateAsObjects(rows, [])]).toThrow()
  })

  it('should throw if all headers are ignored', async () => {
    const ignoreHeaders = new Set(headers)
    expect(() => [...arrTableIterateAsObjects(rows, headers, ignoreHeaders)]).toThrow()
  })

  it('should throw if not all rows are same length as headers', async () => {
    expect(() => [
      ...arrTableIterateAsObjects(
        [
          ['Mark', 'M', '2'],
          ['Anna', 'F'],
        ],
        headers,
      ),
    ]).toThrow()
  })
})
