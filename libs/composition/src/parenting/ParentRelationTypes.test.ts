import { describe, expect, it, beforeEach, vi } from 'vitest'
import assert from 'node:assert'
import { ParentRelationTypes } from './ParentRelationTypes'

// Use the same type definition as in the types library
type FunctionPrototype = typeof Function.prototype

// Mock test classes for testing parent-child relationships
class TestParent {
  static name = 'TestParent'
}

class TestChild {
  static name = 'TestChild'
}

class TestGrandChild {
  static name = 'TestGrandChild'
}

class IsolatedClass {
  static name = 'IsolatedClass'
}

// Mock console.log for testing print functionality
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

describe(ParentRelationTypes.name, () => {
  let parentRelation: ParentRelationTypes
  let childRelation: ParentRelationTypes
  let grandChildRelation: ParentRelationTypes
  let isolatedRelation: ParentRelationTypes

  beforeEach(() => {
    // Clear static state before each test
    ParentRelationTypes.childTypesStats.clear()
    ParentRelationTypes.parentTypesStats.clear()

    // Create fresh instances
    parentRelation = new ParentRelationTypes(TestParent as any)
    childRelation = new ParentRelationTypes(TestChild as any)
    grandChildRelation = new ParentRelationTypes(TestGrandChild as any)
    isolatedRelation = new ParentRelationTypes(IsolatedClass as any)

    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      // Set up parent-child relationships
      childRelation.registerParent(TestParent as FunctionPrototype)
      grandChildRelation.registerParent(TestChild as FunctionPrototype)

      // Test basic relationship properties - these now work correctly after bug fixes
      assert.deepStrictEqual(parentRelation.hasChildren, true) // Has TestChild as child
      assert.deepStrictEqual(childRelation.hasParent, true) // Has TestParent as parent
      assert.deepStrictEqual(childRelation.hasChildren, true) // Has TestGrandChild as child
      assert.deepStrictEqual(grandChildRelation.hasParent, true) // Has TestChild as parent

      // Test hierarchy positions - these now work correctly
      assert.deepStrictEqual(parentRelation.isRoot, true) // Has children but no parent
      assert.deepStrictEqual(grandChildRelation.isLeaf, true) // Has parent but no children
      assert.deepStrictEqual(isolatedRelation.isIsolated, true) // Has neither parent nor children
    }).not.toThrow()
  })

  describe('registerParent', () => {
    it('should register parent-child relationship in stats correctly', () => {
      childRelation.registerParent(TestParent as FunctionPrototype)

      // Test the actual data storage (this works correctly)
      expect(
        ParentRelationTypes.parentTypesStats
          .get(TestChild as FunctionPrototype)
          .has(TestParent as FunctionPrototype),
      ).toBe(true)
      expect(
        ParentRelationTypes.childTypesStats
          .get(TestParent as FunctionPrototype)
          .has(TestChild as FunctionPrototype),
      ).toBe(true)
    })

    it('should handle multiple parent registrations', () => {
      childRelation.registerParent(TestParent as FunctionPrototype)
      childRelation.registerParent(TestParent as FunctionPrototype)

      // Test multiplicities in the actual storage
      expect(
        ParentRelationTypes.parentTypesStats
          .get(TestChild as FunctionPrototype)
          .multiplicity(TestParent as FunctionPrototype),
      ).toBe(2)
      expect(
        ParentRelationTypes.childTypesStats
          .get(TestParent as FunctionPrototype)
          .multiplicity(TestChild as FunctionPrototype),
      ).toBe(2)
    })
  })

  describe('relationship detection properties', () => {
    beforeEach(() => {
      // Set up hierarchy: TestParent -> TestChild -> TestGrandChild
      childRelation.registerParent(TestParent as FunctionPrototype)
      grandChildRelation.registerParent(TestChild as FunctionPrototype)
    })

    it('should correctly detect hasParent relationships', () => {
      // Now working correctly after bug fixes
      expect(parentRelation.hasParent).toBe(false) // TestParent has no parent
      expect(childRelation.hasParent).toBe(true) // TestChild has TestParent as parent
      expect(grandChildRelation.hasParent).toBe(true) // TestGrandChild has TestChild as parent
      expect(isolatedRelation.hasParent).toBe(false) // IsolatedClass has no parent
    })

    it('should correctly detect hasChildren relationships', () => {
      // Now working correctly after bug fixes
      expect(parentRelation.hasChildren).toBe(true) // TestParent has TestChild as child
      expect(childRelation.hasChildren).toBe(true) // TestChild has TestGrandChild as child
      expect(grandChildRelation.hasChildren).toBe(false) // TestGrandChild has no children
      expect(isolatedRelation.hasChildren).toBe(false) // IsolatedClass has no children
    })
  })

  describe('static stats methods', () => {
    beforeEach(() => {
      // Create relationships for testing
      childRelation.registerParent(TestParent as FunctionPrototype)
      grandChildRelation.registerParent(TestChild as FunctionPrototype)
      grandChildRelation.registerParent(TestParent as FunctionPrototype) // Multiple inheritance
    })

    it('should return correct child types stats', () => {
      const childStats = ParentRelationTypes.getAllChildTypesStats()

      expect(childStats.TestParent).toBeDefined()
      expect(childStats.TestParent.TestChild).toBe(1)
      expect(childStats.TestParent.TestGrandChild).toBe(1)
      expect(childStats.TestChild.TestGrandChild).toBe(1)
    })

    it('should return correct parent types stats', () => {
      const parentStats = ParentRelationTypes.getAllParentTypesStats()

      expect(parentStats.TestChild).toBeDefined()
      expect(parentStats.TestChild.TestParent).toBe(1)
      expect(parentStats.TestGrandChild.TestChild).toBe(1)
      expect(parentStats.TestGrandChild.TestParent).toBe(1)
    })

    it('should return comprehensive stats', () => {
      const allStats = ParentRelationTypes.getAllStats()

      expect(allStats).toBeInstanceOf(Array)
      expect(allStats.length).toBeGreaterThan(0)

      const parentStats = allStats.find((stat) => stat.class === 'TestParent')
      const childStats = allStats.find((stat) => stat.class === 'TestChild')
      const grandChildStats = allStats.find((stat) => stat.class === 'TestGrandChild')

      expect(parentStats?.children).toBeDefined()
      expect(childStats?.parents).toBeDefined()
      expect(childStats?.children).toBeDefined()
      expect(grandChildStats?.parents).toBeDefined()
    })
  })

  describe('printAllStats', () => {
    beforeEach(() => {
      childRelation.registerParent(TestParent as FunctionPrototype)
      grandChildRelation.registerParent(TestChild as FunctionPrototype)
    })

    it('should print stats without throwing', () => {
      expect(() => {
        ParentRelationTypes.printAllStats()
      }).not.toThrow()

      expect(mockConsoleLog).toHaveBeenCalled()
    })

    it('should print structured output', () => {
      ParentRelationTypes.printAllStats()

      // Verify that console.log was called with relevant content
      const logCalls = mockConsoleLog.mock.calls.flat()
      const logOutput = logCalls.join(' ')

      expect(logOutput).toContain('Parent-Child Relation Stats')
      expect(logOutput).toContain('TestParent')
      expect(logOutput).toContain('TestChild')
    })
  })

  describe('static data management', () => {
    it('should maintain separate multisets for each class', () => {
      childRelation.registerParent(TestParent as FunctionPrototype)

      const parentChildStats = ParentRelationTypes.childTypesStats.get(TestParent as FunctionPrototype)
      const childParentStats = ParentRelationTypes.parentTypesStats.get(TestChild as FunctionPrototype)

      expect(parentChildStats.size).toBe(1)
      expect(childParentStats.size).toBe(1)
      expect(ParentRelationTypes.childTypesStats.size).toBeGreaterThan(0)
      expect(ParentRelationTypes.parentTypesStats.size).toBeGreaterThan(0)
    })

    it('should handle complex inheritance hierarchies', () => {
      // Create diamond inheritance pattern
      childRelation.registerParent(TestParent as FunctionPrototype)
      grandChildRelation.registerParent(TestParent as FunctionPrototype)
      grandChildRelation.registerParent(TestChild as FunctionPrototype)

      const parentChildren = ParentRelationTypes.childTypesStats.get(TestParent as FunctionPrototype)
      expect(parentChildren.multiplicity(TestChild as FunctionPrototype)).toBe(1)
      expect(parentChildren.multiplicity(TestGrandChild as FunctionPrototype)).toBe(1)

      const grandChildParents = ParentRelationTypes.parentTypesStats.get(TestGrandChild as FunctionPrototype)
      expect(grandChildParents.multiplicity(TestParent as FunctionPrototype)).toBe(1)
      expect(grandChildParents.multiplicity(TestChild as FunctionPrototype)).toBe(1)
    })
  })

  describe('edge cases', () => {
    it('should handle self-registration', () => {
      expect(() => {
        parentRelation.registerParent(TestParent as FunctionPrototype)
      }).not.toThrow()

      // With current buggy implementation
      expect(parentRelation.hasParent).toBe(true)
      expect(parentRelation.hasChildren).toBe(true)
    })

    it('should handle empty stats', () => {
      const emptyChildStats = ParentRelationTypes.getAllChildTypesStats()
      const emptyParentStats = ParentRelationTypes.getAllParentTypesStats()
      const emptyAllStats = ParentRelationTypes.getAllStats()

      expect(emptyChildStats).toEqual({})
      expect(emptyParentStats).toEqual({})
      expect(emptyAllStats).toEqual([])
    })
  })
})
