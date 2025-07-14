/**
 * Returns all indexes at which an element is found.
 * @param input The array to search
 * @template T - The type of elements in the input array.
 * @returns An array of indices where the specified element can be found.
 * @param element The element to find
 * @example ```ts
 *  const inputArray = [1, 2, 3, 2, 4, 2, 5];
 *  const elementToFind = 2;
 *  arrIndicesOf(inputArray, elementToFind);
 *  //=> [1, 3, 5]
 *  ```
 */
export function arrIndicesOf<T>(input: Array<T>, element: T): number[] {
  const result: number[] = []
  for (let i = 0; i < input.length; i++) {
    if (element === input[i]) {
      result.push(i)
    }
  }
  return result
}
