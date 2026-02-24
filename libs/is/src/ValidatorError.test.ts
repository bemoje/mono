import { describe } from "vitest";
import { it } from "vitest";
import { ValidatorError } from './ValidatorError'
import { strict as assert } from 'node:assert'

describe(ValidatorError.name, () => {
  it('examples', () => {
    // should set properties from constructor
    const err = new ValidatorError('fail', {
      input: 123,
      negate: true,
      cause: { foo: false, bar: 'bad' },
    })
    assert.equal(err.message, 'fail', 'message')
    assert.equal(err.input, 123, 'input')
    assert.equal(err.expected, false, 'expected')
    assert.deepEqual(err.cause, { foo: false, bar: 'bad' }, 'cause')
    assert.equal(err.name, 'ValidationError', 'name')
  })

  it('defaults expected to true if negate is not set', () => {
    const err = new ValidatorError('fail', { input: 1 })
    assert.equal(err.expected, true, 'expected')
  })

  it('works with no data', () => {
    const err = new ValidatorError('fail')
    assert.equal(err.message, 'fail', 'message')
    assert.equal(err.expected, true, 'expected')
    assert.equal(err.input, undefined, 'input')
    assert.equal(err.cause, undefined, 'cause')
  })
})
