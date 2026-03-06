import type { TaskMap } from './types'

/**
 * Depth-first search (DFS) algorithm to detect circular dependencies in our task definition graph.
 */
export function hasCircularDependencies<TaskNames extends string>(taskDefinitions: TaskMap<TaskNames>): boolean {
  const visited = new Set<TaskNames>()
  const recursionStack = new Set<TaskNames>()

  const dfs = (task: TaskNames): boolean => {
    if (recursionStack.has(task)) {
      return true
    }
    if (visited.has(task)) {
      return false
    }
    visited.add(task)
    recursionStack.add(task)

    for (const dependency of taskDefinitions[task].dependencies) {
      if (dfs(dependency)) {
        return true
      }
    }

    recursionStack.delete(task)
    return false
  }

  for (const task of Object.keys(taskDefinitions) as TaskNames[]) {
    if (dfs(task)) {
      return true
    }
  }

  return false
}
