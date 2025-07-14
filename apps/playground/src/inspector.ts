import { Inspector, InspectorTarget } from '@mono/composition'

declare module './inspector' {
  export interface A extends InspectorTarget {}
}

export class A {
  static inspector = Inspector.compose(A, {
    keys: ['one', 'two', 'a'],
    ignoreValues: { noFalse: true },
  })

  constructor() {}

  get a() {
    return 'a'
  }
  get one() {
    return 1
  }
}

export class B extends A {
  static inspector = Inspector.compose(B, {
    keys: ['three', 'b', 'c'],
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

for (const x of [new A(), new B(), new A(), new B()]) {
  console.log(x.inspector.inspect())
}
