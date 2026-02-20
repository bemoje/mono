/**
 * Return type of a validator function, @see Validator.
 *
 * A reason for failed validation can be returned as string type.
 *
 * Literal type interpretation:
 * - Valid: `true`
 * - Invalid: `false | void | string`
 */
export type ValidatorResult = boolean | string | void | false | true

/**
 * A sync validator function.
 * @see ValidatorResult
 */
export type SyncValidator = (...args: any[]) => ValidatorResult

/**
 * An async validator function.
 * @see ValidatorResult
 */
export type AsyncValidator = (...args: any[]) => Promise<ValidatorResult>

/**
 * A sync or an async validator function.
 * @see SyncValidator
 * @see AsyncValidator
 */
export type Validator = SyncValidator | AsyncValidator
