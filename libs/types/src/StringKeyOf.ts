export type StringKeyOf<T> = Extract<keyof T, string>
export default StringKeyOf
