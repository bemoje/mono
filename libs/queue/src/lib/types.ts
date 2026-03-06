// If T is not provided, it will not be used
export type TaskMap<TaskNames extends string, T = Record<string, unknown>> = {
  [K in TaskNames]: TaskDefinition<TaskNames, K> & T
}

type ExcludeSelf<TaskNames extends string, T extends string> = Exclude<TaskNames, T>

export type TaskDefinition<TaskNames extends string, T extends string> = {
  dependencies: NoInfer<ExcludeSelf<TaskNames, T>>[]
  run: () => Promise<void>
  priority?: number
}

export interface IAsyncDependencyQueueOptions<TaskNames extends string> {
  concurrency: number
  taskDefinitions: TaskMap<TaskNames>
}
