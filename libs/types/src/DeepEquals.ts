/**
 * Equaliity - utility types fpor comparing equality of types.
 *
 *
 *
 * @remarks
 * - There are two very similar versions of the various functions.
 * - One returns boolean 'true' or 'false'
 * - The other returns the input type  `T` or `never`
 * ------------
 *
 *
 * @remarks
 * istributed Conditional Type  ( >> WITH <<  `T extends any` )
 * - Aka. `Strict` match
 * --Use when you want to process each member of a union separately.
 * --Great for utility types that need to filter or transform union members.
 * --Common in libraries to ensure type compatibility across each union member.
 *
 *
 * Non-Distributed Conditional Type  ( >> WIHOUT <<  `T extends any` )
 * - Use when you need to evaluate the entire type as a single unit.
 * - Ideal for enforcing exact, whole-type equality.
 * - Helpful for avoiding unintended distribution, especially in complex types.
 * ------------
 */

/**
 * Deep equality aka. structuraæ equality aka. exacy matching
 *
 *  Deep equality
 * @returns {true|false}
 * - @see IsDeepEqual -  'false' / 'true'
 * - @see DeepEquals  -  'never' / 'T'
 */

export type IsDeepEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false

/**
 *
 * Deep equality aka. structuraæ equality aka. exacy matching
 * @returns {<T>|never }
 */
export type DeepEquals<T, U> = IsDeepEqual<T, U> extends true ? T : never

/**
 * Test equality with strict matching strategty.
 *
 * Strict EQquality
 * - @see StrictEquals
 * - @see IsStrictEqual
 * @returns {true|false}
 */
export type IsStrictEqual<T, Target> = StrictEquals<T, Target> extends never ? false : true

/**
 * Test equality with strict matching strategty.
 * @returns {<T>|never }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StrictEquals<T, Target> = T extends any ? (IsDeepEqual<T, Target> extends true ? T : never) : never
