import { Readable } from 'stream'

/**
 * Extension of Node's native Readable class for converting a string into a Readable stream.
 * @param string - The string to create the stream from.
 */
export class StringStream extends Readable {
  string: string
  ended: boolean

  constructor(string: string) {
    super()
    this.string = string
    this.ended = false
  }

  override _read(): void {
    if (!this.ended) {
      process.nextTick(() => {
        this.push(Buffer.from(this.string))
        this.push(null)
      })
      this.ended = true
    }
  }
}
