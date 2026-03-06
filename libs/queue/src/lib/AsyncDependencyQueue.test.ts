import { AsyncDependencyQueue } from './AsyncDependencyQueue'
import type { TaskMap } from './types'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { setTimeout } from 'timers/promises'
import { vi } from 'vitest'

function getSpies() {
  return { spy1: vi.fn(), spy2: vi.fn(), spy3: vi.fn(), spy4: vi.fn() }
}

describe('AsyncDependencyQueue', () => {
  const TaskNames = { task1: 'task1', task2: 'task2', task3: 'task3', task4: 'task4' } as const
  type TaskNames = keyof typeof TaskNames
  type SmallTaskNames = Exclude<TaskNames, 'task3' | 'task4'>

  it('should run tasks in the correct order based on dependencies', async () => {
    const { spy1, spy2, spy3, spy4 } = getSpies()
    const tasks: TaskMap<TaskNames> = {
      task1: { dependencies: [], run: spy1 },
      task2: { dependencies: ['task1'], run: spy2 },
      task3: { dependencies: ['task2'], run: spy3 },
      task4: { dependencies: ['task3'], run: spy4 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy3).toHaveBeenCalledOnce()
    expect(spy4).toHaveBeenCalledOnce()

    expect(spy1.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
    expect(spy2.mock.invocationCallOrder[0]).toBeLessThan(spy3.mock.invocationCallOrder[0])
    expect(spy3.mock.invocationCallOrder[0]).toBeLessThan(spy4.mock.invocationCallOrder[0])
  })

  it('should handle tasks with no dependencies', async () => {
    const { spy1, spy2 } = getSpies()
    const tasks: TaskMap<SmallTaskNames> = {
      task1: { dependencies: [], run: spy1 },
      task2: { dependencies: [], run: spy2 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
  })

  it('should handle circular dependencies gracefully', async () => {
    const { spy1, spy2 } = getSpies()
    const tasks: TaskMap<SmallTaskNames> = {
      task1: { dependencies: ['task2'], run: spy1 },
      task2: { dependencies: ['task1'], run: spy2 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await expect(dependencyQueue.run()).rejects.toThrow()
  })

  it(
    'should adhere to the concurrency limit',
    async () => {
      const tasks: TaskMap<TaskNames> = {
        task1: {
          dependencies: [],
          run: vi.fn(async () => {
            return await setTimeout(10)
          }),
        },
        task2: {
          dependencies: ['task1'],
          run: vi.fn(async () => {
            return await setTimeout(10)
          }),
          priority: 1,
        },
        task3: {
          dependencies: ['task2'],
          run: vi.fn(async () => {
            return await setTimeout(10)
          }),
        },
        task4: {
          dependencies: ['task1'],
          run: vi.fn(async () => {
            return await setTimeout(10)
          }),
        },
      }

      const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

      const runPromise = dependencyQueue.run()
      await flushPromises()
      expect(tasks.task1.run).toHaveBeenCalledOnce()
      expect(tasks.task2.run).not.toHaveBeenCalled()
      expect(tasks.task3.run).not.toHaveBeenCalled()
      expect(tasks.task4.run).not.toHaveBeenCalled()

      await setTimeout(10)
      await flushPromises()
      expect(tasks.task2.run).toHaveBeenCalledOnce()
      expect(tasks.task3.run).not.toHaveBeenCalled()
      expect(tasks.task4.run).not.toHaveBeenCalled()

      await setTimeout(10)
      await flushPromises()
      expect(tasks.task3.run).not.toHaveBeenCalled()
      expect(tasks.task4.run).toHaveBeenCalledOnce()

      await setTimeout(10)
      await flushPromises()
      expect(tasks.task3.run).toHaveBeenCalledOnce()

      await runPromise
    },
    { retry: 3 }
  )

  it('should handle tasks with the same dependencies', async () => {
    const { spy1, spy2, spy3, spy4 } = getSpies()
    const tasks: TaskMap<TaskNames> = {
      task1: { dependencies: [], run: spy1 },
      task2: { dependencies: ['task1'], run: spy2 },
      task3: { dependencies: ['task1'], run: spy3 },
      task4: { dependencies: ['task1'], run: spy4 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy3).toHaveBeenCalledOnce()
    expect(spy4).toHaveBeenCalledOnce()
  })

  it('should handle tasks with dependencies that have already been completed', async () => {
    const { spy1, spy2 } = getSpies()
    const tasks: TaskMap<SmallTaskNames> = {
      task1: { dependencies: [], run: spy1 },
      task2: { dependencies: ['task1'], run: spy2 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
  })

  it('should handle tasks with dependency chains', async () => {
    const { spy1, spy2, spy3, spy4 } = getSpies()
    const tasks: TaskMap<TaskNames> = {
      task1: { dependencies: [], run: spy1 },
      task2: { dependencies: ['task1'], run: spy2 },
      task3: { dependencies: ['task2'], run: spy3 },
      task4: { dependencies: ['task3'], run: spy4 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy3).toHaveBeenCalledOnce()
    expect(spy4).toHaveBeenCalledOnce()
    expect(spy1.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
    expect(spy2.mock.invocationCallOrder[0]).toBeLessThan(spy3.mock.invocationCallOrder[0])
    expect(spy3.mock.invocationCallOrder[0]).toBeLessThan(spy4.mock.invocationCallOrder[0])
  })

  it('should handle tasks with dependency chains with concurrency', async () => {
    const { spy1, spy2, spy3, spy4 } = getSpies()
    const tasks: TaskMap<TaskNames> = {
      task1: { dependencies: [], run: spy1 },
      task2: { dependencies: ['task1'], run: spy2 },
      task3: { dependencies: ['task2'], run: spy3 },
      task4: { dependencies: ['task3'], run: spy4 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 2, taskDefinitions: tasks })

    await dependencyQueue.run()
    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy3).toHaveBeenCalledOnce()
    expect(spy4).toHaveBeenCalledOnce()
    expect(spy1.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
    expect(spy2.mock.invocationCallOrder[0]).toBeLessThan(spy3.mock.invocationCallOrder[0])
    expect(spy3.mock.invocationCallOrder[0]).toBeLessThan(spy4.mock.invocationCallOrder[0])
  })

  it('should complete tasks in the correct order when a priority is set', async () => {
    const { spy1, spy2, spy3, spy4 } = getSpies()

    const tasks: TaskMap<TaskNames> = {
      task1: { priority: 0, dependencies: [], run: spy1 },
      task2: { priority: 1, dependencies: [], run: spy2 },
      task3: { priority: 2, dependencies: [], run: spy3 },
      task4: { priority: 3, dependencies: [], run: spy4 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy3).toHaveBeenCalledOnce()
    expect(spy4).toHaveBeenCalledOnce()
    expect(spy4.mock.invocationCallOrder[0]).toBeLessThan(spy3.mock.invocationCallOrder[0])
    expect(spy3.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
    expect(spy2.mock.invocationCallOrder[0]).toBeLessThan(spy1.mock.invocationCallOrder[0])
  })

  it('should handle tasks with dependencies that have already been completed with priority', async () => {
    const { spy1, spy2 } = getSpies()
    const tasks: TaskMap<SmallTaskNames> = {
      task1: { priority: 0, dependencies: [], run: spy1 },
      task2: { priority: 1, dependencies: ['task1'], run: spy2 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 1, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy1.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
  })

  it('should handle tasks with dependencies that have already been completed with priority and concurrency', async () => {
    const { spy1, spy2, spy3, spy4 } = getSpies()

    const tasks: TaskMap<TaskNames> = {
      task1: { priority: 0, dependencies: [], run: spy1 },
      task2: { priority: 1, dependencies: ['task1'], run: spy2 },
      task3: { priority: 2, dependencies: ['task2', 'task1'], run: spy3 },
      task4: { priority: 3, dependencies: [], run: spy4 },
    }

    const dependencyQueue = new AsyncDependencyQueue({ concurrency: 2, taskDefinitions: tasks })

    await dependencyQueue.run()

    expect(spy1).toHaveBeenCalledOnce()
    expect(spy2).toHaveBeenCalledOnce()
    expect(spy3).toHaveBeenCalledOnce()
    expect(spy4).toHaveBeenCalledOnce()

    expect(spy1.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
    expect(spy2.mock.invocationCallOrder[0]).toBeLessThan(spy3.mock.invocationCallOrder[0])
    expect(spy4.mock.invocationCallOrder[0]).toBeLessThan(spy2.mock.invocationCallOrder[0])
  })
})

function flushPromises() {
  return new Promise(setImmediate)
}
