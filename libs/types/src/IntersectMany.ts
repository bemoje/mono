/**
 * Same as the native `Extract`, but for multiple types.
 *
 * @example
 * type A = 'a' | 'b' | 'c';
 * type B = 'b' | 'c' | 'd';
 * type C = 'c' | 'd' | 'e';
 *
 * type Intersection = IntersectMany<[A, B, C]>;
 * //=> "c"
 */
export type IntersectMany<Types extends string[]> = Types extends [infer First, ...infer Rest extends string[]]
  ? Rest extends []
    ? First
    : Extract<First, IntersectMany<Rest>>
  : never
