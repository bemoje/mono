/**
 * Checks if the provided value implements the Map interface with the specified required properties.
 */
export function isGenericMap<Props extends (keyof Map<K, V>)[], K, V>(
  target: unknown,
  requiredProps: Props = ['get', 'set', 'has'] as unknown as Props,
): target is Pick<Map<K, V>, Props[number]> {
  return !!target && requiredProps.every((prop) => typeof (target as never)[prop] === typeof Map.prototype[prop])
}
