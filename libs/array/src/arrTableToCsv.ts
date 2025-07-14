/**
 * Converts a 2D array to a CSV string.
 * @param input The input 2D array.
 * @remarks This function is useful for exporting data to CSV format.
 * @param replaceLinebreakWith The character used to replace line breaks in the CSV string. Defaults to '|'.
 * @typeparam T - The type of the elements in the input array.
 * @returns The CSV string representation of the input array.
 * @param delimiter The delimiter to use for separating values in the CSV string.
 * @example ```ts
 * const input = [
 *   ['Name', 'Age', 'Country'],
 *   ['John', '25', 'USA'],
 *   ['Alice', '30', 'Canada'],
 *   ['Bob', '35', 'UK'],
 * ];
 * arrTableToCsv(input);
 * //=> "Name;Age;Country\nJohn;25;USA\nAlice;30;Canada\nBob;35;UK"
 * ```
 */
export function arrTableToCsv<T>(input: T[][], delimiter = ';', replaceLinebreakWith = '<br>'): string {
  return input
    .map((row) => {
      return row
        .map((item) => String(item).replace(new RegExp(';', 'g'), '').replace(/\r*\n/g, replaceLinebreakWith))
        .join(delimiter)
    })
    .join('\n')
}
