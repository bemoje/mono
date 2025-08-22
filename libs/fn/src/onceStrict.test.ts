import { describe, it } from 'vitest'
import assert from 'node:assert'
import { onceStrict } from './onceStrict'

describe(onceStrict.name, () => {
  it('examples', async () => {
    let count = 0
    const increment = async () => ++count
    const onceStrictIncrement = onceStrict(increment)

    // First call should work
    const result = await onceStrictIncrement()
    assert.deepStrictEqual(result, 1, 'first call')

    // Second call should throw
    try {
      await onceStrictIncrement()
      assert.fail('should have thrown')
    } catch (error) {
      assert.ok(error instanceof Error, 'should throw error')
    }
  })
})
