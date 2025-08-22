import { vi, it, expect, describe } from 'vitest'
import * as extractModule from 'extract-zip'
import { unzip } from './unzip' // Adjust path if necessary

vi.mock('extract-zip', () => ({
  default: vi.fn(),
}))

describe(unzip, () => {
  it('should call extract with the correct arguments', async () => {
    const extractMock = vi.mocked(extractModule.default).mockImplementation(vi.fn())

    const filepath = 'path/to/zipfile.zip'
    const outdir = 'path/to/output'

    await unzip(filepath, outdir)

    expect(extractMock).toHaveBeenCalledWith(filepath, { dir: outdir })
  })

  it('should throw an error if extract fails', async () => {
    const error = new Error('oops')
    vi.mocked(extractModule.default).mockImplementation(vi.fn().mockRejectedValue(error))

    const filepath = 'path/to/zipfile.zip'
    const outdir = 'path/to/output'

    await expect(unzip(filepath, outdir)).rejects.toThrow('oops')
  })
})
