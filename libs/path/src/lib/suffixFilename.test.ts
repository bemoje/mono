import { describe, it, expect } from 'vitest'
import { suffixFilename } from './suffixFilename'

describe(suffixFilename.name, function () {
  it('should append string to the end of the filename', function () {
    expect(suffixFilename('path/to/file-name.ext', '-old')).toBe('path/to/file-name-old.ext')
  })
})
