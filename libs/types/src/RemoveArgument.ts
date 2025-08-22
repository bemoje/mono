import { ParametersWithout } from './ParametersWithout'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RemoveArgument<T extends (...args: any[]) => any, Index extends number> = (
  ...args: ParametersWithout<T, Index>
) => ReturnType<T>
