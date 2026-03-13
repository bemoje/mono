import { AbstractBase } from './AbstractBase'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

class ConcreteBase extends AbstractBase {
  constructor(parent: any) {
    super(parent)
  }
}

describe(AbstractBase.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(AbstractBase.inspector).toBeDefined()
    })
  })

  describe('constructor', () => {
    it('should create an instance with a parent', () => {
      const parent = new ConcreteBase(null)
      const child = new ConcreteBase(parent)
      expect(child).toBeInstanceOf(AbstractBase)
    })
  })

  describe('parent', () => {
    it('should return the parent', () => {
      const parent = new ConcreteBase(null)
      const child = new ConcreteBase(parent)
      expect(child.parent).toBe(parent)
    })
  })

  describe('findParentDeep', () => {
    it('should find a parent matching a predicate', () => {
      const grandparent = new ConcreteBase(null)
      const parent = new ConcreteBase(grandparent)
      const child = new ConcreteBase(parent)
      const found = child.findParentDeep((p) => {
        return p === grandparent
      })
      expect(found).toBe(grandparent)
    })

    it('should return undefined when no parent matches', () => {
      const parent = new ConcreteBase(null)
      const child = new ConcreteBase(parent)
      const found = child.findParentDeep(() => {
        return false
      })
      expect(found).toBeUndefined()
    })
  })

  describe('getParentDeep', () => {
    it('should return a parent of the given type', () => {
      const parent = new ConcreteBase(null)
      const child = new ConcreteBase(parent)
      expect(child.getParentDeep(ConcreteBase)).toBe(parent)
    })

    it('should throw when parent of given type is not found', () => {
      class OtherBase extends AbstractBase {
        constructor() {
          super(null)
        }
      }
      const child = new ConcreteBase(null)
      expect(() => {
        return child.getParentDeep(OtherBase)
      }).toThrow('Parent of type OtherBase not found.')
    })
  })
})
