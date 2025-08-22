import { Readable } from 'stream'
import { streamToString } from './streamToString'
import { describe, expect, it } from 'vitest'

describe('streamToString', () => {
  it('should return an empty string for an empty stream', async () => {
    const stream = new Readable()
    const result = await streamToString(stream)
    expect(result).toEqual('')
  })

  it('should return a string with the same contents as the stream', async () => {
    const stream = new Readable()
    stream.push('hello ')
    stream.push('world!')
    stream.push(null)
    const result = await streamToString(stream)
    expect(result).toEqual('hello world!')
  })

  it('should handle large streams', async () => {
    const stream = new Readable()
    for (let i = 0; i < 100000; i++) {
      const value = i % 10
      stream.push(value.toString())
    }
    stream.push(null)
    const result = await streamToString(stream)
    expect(result.length).toBe(100000)
  })
})
