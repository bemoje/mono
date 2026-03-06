import type { TaskMap } from './types'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { hasCircularDependencies } from './hasCircularDependencies'
import { it } from 'vitest'

describe('hasCircularDependencies', () => {
  it('should return false for no dependencies', () => {
    const taskDefinitions: TaskMap<'taskA' | 'taskB'> = {
      taskA: { dependencies: [], run: async () => {} },
      taskB: { dependencies: [], run: async () => {} },
    }

    expect(hasCircularDependencies(taskDefinitions)).toBe(false)
  })

  it('should return false for linear dependencies', () => {
    const taskDefinitions: TaskMap<'taskA' | 'taskB' | 'taskC'> = {
      taskA: { dependencies: ['taskB'], run: async () => {} },
      taskB: { dependencies: ['taskC'], run: async () => {} },
      taskC: { dependencies: [], run: async () => {} },
    }

    expect(hasCircularDependencies(taskDefinitions)).toBe(false)
  })

  it('should return true for direct circular dependency', () => {
    const taskDefinitions: TaskMap<'taskA' | 'taskB'> = {
      taskA: { dependencies: ['taskB'], run: async () => {} },
      taskB: { dependencies: ['taskA'], run: async () => {} },
    }

    expect(hasCircularDependencies(taskDefinitions)).toBe(true)
  })

  it('should return true for indirect circular dependency', () => {
    const taskDefinitions: TaskMap<'taskA' | 'taskB' | 'taskC'> = {
      taskA: { dependencies: ['taskB'], run: async () => {} },
      taskB: { dependencies: ['taskC'], run: async () => {} },
      taskC: { dependencies: ['taskA'], run: async () => {} },
    }

    expect(hasCircularDependencies(taskDefinitions)).toBe(true)
  })

  it('should return false for complex acyclic graph', () => {
    const taskDefinitions: TaskMap<'taskA' | 'taskB' | 'taskC' | 'taskD'> = {
      taskA: { dependencies: ['taskB', 'taskC'], run: async () => {} },
      taskB: { dependencies: ['taskD'], run: async () => {} },
      taskC: { dependencies: ['taskD'], run: async () => {} },
      taskD: { dependencies: [], run: async () => {} },
    }

    expect(hasCircularDependencies(taskDefinitions)).toBe(false)
  })

  it('should return true for complex cyclic graph', () => {
    const taskDefinitions: TaskMap<'taskA' | 'taskB' | 'taskC' | 'taskD'> = {
      taskA: { dependencies: ['taskB', 'taskC'], run: async () => {} },
      taskB: { dependencies: ['taskD'], run: async () => {} },
      taskC: { dependencies: ['taskD'], run: async () => {} },
      taskD: { dependencies: ['taskA'], run: async () => {} },
    }

    expect(hasCircularDependencies(taskDefinitions)).toBe(true)
  })
})
