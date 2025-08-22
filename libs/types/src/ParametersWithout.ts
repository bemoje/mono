import { RemoveArrayElement } from './RemoveArrayElement'

export type ParametersWithout<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => any,
  Index extends number,
> = RemoveArrayElement<Parameters<T>, Index>
