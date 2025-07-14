import { Readable } from 'stream'

/**
 * Drain a Readable into a string.
 * @remarks This function is asynchronous and returns a promise that resolves to a string.
 * If an error occurs during the conversion, it returns an empty string.
 * @returns A promise that resolves to a string.
 * @param stream a Readable of string chunks
 * @example ```ts
 * require('fs').createReadStream('file.txt');
 * //=> {stream}
 * await streamToString(fs.createReadStream('file.txt'));
 * //=> {content of 'file.txt'}
 * ```
 */
export async function streamToString(stream: Readable): Promise<string> {
  const chunks: string[] = []
  try {
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk).toString())
    }
  } catch (error) {
    return ''
  }
  return chunks.join('')
}
