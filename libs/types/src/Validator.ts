/**
 * Return type of a boolean predicate validator function
 * @see SyncPredicateValidator
 *
 * Literal type interpretation:
 * - Pass: `true`
 * - Fail: `void | false`
 */
export type ValidatorBooleanResult = boolean | true | false | void

/**
 * Return type of a failure reason predicate validator function
 * @see SyncReasonedValidator
 *
 * A reason for failed validation can be returned as string type.
 *
 * Literal type interpretation:
 * - Pass: `true` | `void`
 * - Fail: `string`
 */
export type ValidatorStringResult = string | true | void

/**
 * Union type for all possible validator return values.
 * @see ValidatorBooleanResult
 * @see ValidatorStringResult
 */
export type ValidatorResult = ValidatorBooleanResult | ValidatorStringResult

//

/**
 * A sync boolean predicate validator function.
 * @see ValidatorBooleanResult
 */
export type SyncPredicateValidator = (...args: any[]) => ValidatorBooleanResult

/**
 * A sync failure reason predicate validator function.
 * @see ValidatorStringResult
 */
export type SyncReasonedValidator = (...args: any[]) => ValidatorStringResult

/**
 * A sync validator function.
 * @see SyncPredicateValidator
 * @see SyncReasonedValidator
 */
export type SyncValidator = SyncPredicateValidator | SyncReasonedValidator

//

/**
 * An async boolean predicate validator function.
 * @see ValidatorBooleanResult
 */
export type AsyncPredicateValidator = (...args: any[]) => Promise<ValidatorBooleanResult>

/**
 * An async failure reason predicate validator function.
 * @see ValidatorStringResult
 */
export type AsyncReasonedValidator = (...args: any[]) => Promise<ValidatorStringResult>

/**
 * An async validator function.
 * @see AsyncPredicateValidator
 * @see AsyncReasonedValidator
 */
export type AsyncValidator = AsyncPredicateValidator | AsyncReasonedValidator

//

/**
 * Union type of any either <sync, async> either <predicate, reasoned> validator function.
 * @see SyncValidator
 * @see AsyncValidator
 */
export type Validator = SyncValidator | AsyncValidator
