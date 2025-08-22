import { describe, expect, it } from 'vitest'
import { Inspector, InspectorTarget } from './Inspector'

describe(Inspector.name, () => {
  it('examples', () => {
    class A {
      static inspector = Inspector.compose(A, {
        keys: ['one', 'two', 'a'],
        ignoreValues: { noFalse: true },
        autoAddBooleanKeys: true,
      })

      get a() {
        return 'a'
      }
      get one() {
        return 1
      }
    }

    class B extends A {
      static inspector = Inspector.compose(B, {
        keys: ['three', 'b'],
        ignoreKeys: ['a'],
      })

      get two() {
        return 2
      }
      get three() {
        return 3
      }
      get b() {
        return 'b'
      }
      get c() {
        return 'c'
      }
    }

    const instances = [new A(), new B(), new A(), new B()]
    const inspectStrings = instances.map((x) =>
      (x as unknown as InspectorTarget).inspector.inspect(0, { colors: false }),
    )
    const [a1, b1, a2, b2] = inspectStrings

    expect(a1).toBe(`[A] { one: 1, a: 'a' }`)
    expect(b1).toBe(`[B] { one: 1, two: 2, three: 3, b: 'b' }`)
    expect(a2).toBe(`[A] { one: 1, a: 'a' }`)
    expect(b2).toBe(`[B] { one: 1, two: 2, three: 3, b: 'b' }`)

    instances
      .map((x) => (x as unknown as InspectorTarget).inspector.toObject())
      .forEach((obj, i) => {
        expect(obj).toBeTypeOf('object')
      })
  })
})
