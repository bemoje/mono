import type { Any } from './Any'

export type AnyAsyncFunction = (...args: Any[]) => Promise<Any>
