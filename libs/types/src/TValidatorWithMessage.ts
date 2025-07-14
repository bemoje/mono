/**
 * A validator function that returns 'true' if VALUE is valid and an string (reason/error/info) message if invalid.
 * Return type does not include 'false' unless AcceptFalseAsReturnType is set to true.
 */
export type TValidatorWithMessage<T, AcceptFalseAsReturnType extends boolean = false> = (
  value: T,
  ...args: any[]
) => string | (AcceptFalseAsReturnType extends true ? boolean : true)
