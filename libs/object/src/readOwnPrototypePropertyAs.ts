/**
 * Gets the property descriptor of the target object at key, and reads the value of the property.
 * If the property is a getter, the getter is called with the target object as this,
 * otherwise the value is returned normally.
 */
export function readOwnPrototypePropertyAs<Ret, T extends object, This extends object>(
  self: This,
  target: T,
  key: string | symbol,
): Ret | undefined {
  const des = Reflect.getOwnPropertyDescriptor(target, key)
  if (!des) return undefined
  if (des.get) return des.get.call(self) as Ret
  return des.value as Ret
}
