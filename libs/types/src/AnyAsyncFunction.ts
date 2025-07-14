import { Any } from './Any'

export type AnyAsyncFunction = (...args: Any[]) => Promise<Any>
