/* eslint-disable @typescript-eslint/no-explicit-any */

export type ParametersFirstOptional<T extends (...args: any) => any> = T extends (
  arg: infer F,
  ...rest: infer R
) => any
  ? Parameters<(arg?: F, ...rest: R) => any>
  : never
