// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IsAsyncFunction<T> = T extends (...args: any[]) => Promise<any> ? true : false
