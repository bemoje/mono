import { Parenting, ParentingTarget, ParentRelationTypes } from '@mono/composition'

declare module './parenting' {
  export interface Root extends ParentingTarget<null> {}
  export interface Node extends ParentingTarget<Root | Node> {}
  export interface Leaf extends ParentingTarget<Root | Node> {}
}

/**
 * Without decorator
 */
@Parenting.compose
export class Root {
  constructor() {
    this.parenting.onInstance(null)
  }
}

/**
 * Decorator with options
 */
@Parenting.compose
export class Node {
  constructor(parent: Root | Node) {
    this.parenting.onInstance(parent)
  }
}

/**
 * Decorator with options as static property 'profiler'
 */
@Parenting.compose
export class Leaf {
  constructor(parent: Root | Node) {
    this.parenting.onInstance(parent)
  }

  unused() {}
  ignored() {}
}

const R0 = new Root()

const N1 = new Node(R0)
const N2 = new Node(R0)
const L3 = new Leaf(R0)

const N4 = new Node(N1)
const L4 = new Leaf(N2)
const L5 = new Leaf(N2)

const L6 = new Leaf(N4)
const L7 = new Leaf(N4)

//
console.log('---------------')
const nodes = [R0, N1, N2, L3, N4, L4, L5, L6, L7]
nodes.forEach((node, i) => {
  console.log(node.constructor.name.substring(0, 1) + i + '.depth: ' + node.parenting.depth)
})
console.log('---------------')

//
ParentRelationTypes.printAllStats()
