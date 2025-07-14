import { describe, it, expect } from 'vitest'
import { prefixFilename } from './prefixFilename'

describe(prefixFilename.name, function () {
  it('should append string at the beginning of the filename', function () {
    expect(prefixFilename('path/to/file-name.ext', 'new-')).toBe('path/to/new-file-name.ext')
  })
})
