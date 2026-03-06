import type { IAsyncDependencyQueueOptions } from './types'
import PQueue from 'p-queue'
import type { TaskMap } from './types'
import { hasCircularDependencies } from './hasCircularDependencies'

/**
 * Represents an asynchronous queue that manages task execution based on dependencies and priority.
 */
export class AsyncDependencyQueue<TaskNames extends string> {
  /**
   * The underlying queue handling task concurrency and execution.
   * Utilizes the [PQueue](https://github.com/sindresorhus/p-queue) library for managing asynchronous tasks.
   */
  readonly queue: PQueue

  /**
   * A map defining each task and its associated properties
   */
  private readonly taskDefinitions: TaskMap<TaskNames>

  /**
   * Map from Tasks to their dependencies that have not yet been completed.
   */
  private readonly pendingDependencies: Map<TaskNames, Set<TaskNames>>

  private readonly completedTasks: Set<TaskNames>

  /**
   * Creates an instance of {@link AsyncDependencyQueue}.
   *
   * @param opts - Configuration options for the AsyncDependencyQueue.
   * @param opts.concurrency - The maximum number of tasks to run concurrently.
   * @param opts.taskDefinitions - A map of task definitions, including dependencies and execution functions.
   */
  constructor(opts: IAsyncDependencyQueueOptions<TaskNames>) {
    this.queue = new PQueue({ concurrency: opts.concurrency, autoStart: false })
    this.taskDefinitions = opts.taskDefinitions
    this.pendingDependencies = new Map()
    this.completedTasks = new Set()
  }

  /**
   * Initiates the execution of the task queue.
   *
   * @throws {Error} If circular dependencies are detected in the task definitions.
   */
  async run() {
    await this.initQueue()
    await this.queue.start().onIdle()
  }

  /**
   * Retrieves an array of all task names defined in the task definitions.
   */
  private async getNodeArray(): Promise<TaskNames[]> {
    return Object.keys(this.taskDefinitions) as TaskNames[]
  }

  /**
   * Determines whether a given task has any dependencies.
   *
   * @param task - The name of the task to check for dependencies.
   * @returns `true` if the task has one or more dependencies; otherwise, `false`.
   */
  private hasDependencies(task: TaskNames): boolean {
    return this.taskDefinitions[task].dependencies.length > 0
  }

  /**
   * Constructs the dependency graph by populating the `pendingDependencies` map.
   *
   * For each task, if it has dependencies, those dependencies are added to the `pendingDependencies` map.
   *
   * @param nodes - An array of task names to include in the dependency graph.
   */
  private async buildDependencyGraph(nodes: TaskNames[]) {
    for (const task of nodes) {
      if (!this.hasDependencies(task)) {
        continue
      }
      const dependencies = new Set(this.taskDefinitions[task].dependencies)
      this.pendingDependencies.set(task, dependencies)
    }
  }

  /**
   * Marks a task as completed and updates the dependency graph accordingly.
   *
   * When a task is completed, it is added to the `completedTasks` set.
   * Any tasks that were waiting on this task have their dependencies updated.
   * If a dependent task has no remaining dependencies, it is added to the queue.
   *
   * @param task - The name of the task that has been completed.
   */
  private markTaskAsCompleted(task: TaskNames) {
    this.completedTasks.add(task)
    const pendingDeps = [...this.pendingDependencies.keys()]
    for (const dependentTask of this.getTaskNamesByPriority(pendingDeps)) {
      const dependencies = this.pendingDependencies.get(dependentTask)
      if (!dependencies) {
        continue
      }
      dependencies.delete(task)
      if (dependencies.size === 0) {
        this.pendingDependencies.delete(dependentTask)
        this.addTaskToQueue(dependentTask)
      }
    }
  }

  /**
   * Adds a task to the execution queue.
   *
   * The task is wrapped in an asynchronous function that executes the task's `run` method and marks the task as completed upon successful execution.
   *
   * @param task - The name of the task to add to the queue.
   */
  private addTaskToQueue(task: TaskNames) {
    const taskDef = this.taskDefinitions[task]
    void this.queue.add(
      async () => {
        await taskDef.run()
        this.markTaskAsCompleted(task)
      },
      { priority: taskDef.priority ?? 0 }
    )
  }

  /**
   * Adds all non-dependent tasks to the queue.
   *
   * Non-dependent tasks are those without any dependencies and can be executed immediately.
   *
   * @param nodes - An array of task names to evaluate for dependency-free execution.
   * @throws {Error} If no tasks were added, indicating potential cyclic dependencies or empty task definitions.
   */
  private async addNonDependentTasks(nodes: TaskNames[]) {
    let addedATask = false
    for (const task of this.getTaskNamesByPriority(nodes)) {
      if (this.hasDependencies(task)) {
        continue
      }
      this.addTaskToQueue(task)
      addedATask = true
    }
    if (!addedATask) {
      throw new Error('The task definitions contain a cycle or are empty')
    }
  }

  /**
   * Sorts an array of task names by priority.
   */
  private getTaskNamesByPriority(nodes: TaskNames[]): TaskNames[] {
    return nodes
      .map((task) => {
        return { task, taskDef: this.taskDefinitions[task] }
      })
      .sort((a, b) => {
        return (b.taskDef.priority ?? 0) - (a.taskDef.priority ?? 0)
      })
      .map((task) => {
        return task.task
      })
  }

  /**
   * Initializes the task queue by building the dependency graph and adding initial tasks.
   *
   * This method checks for circular dependencies, constructs the dependency graph, and adds all tasks without dependencies to the queue to kick off the execution process.
   *
   * @throws {Error} If circular dependencies are detected within the task definitions.
   */
  private async initQueue() {
    if (hasCircularDependencies(this.taskDefinitions)) {
      throw new Error('Circular dependencies detected in task definitions')
    }
    const nodes = await this.getNodeArray()
    await this.buildDependencyGraph(nodes)
    await this.addNonDependentTasks(nodes)
  }
}
