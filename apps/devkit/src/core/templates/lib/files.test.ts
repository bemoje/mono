import { describe } from 'vitest'
import { expect } from 'vitest'
import { files } from './files'
import { it } from 'vitest'

describe('template files', () => {
  it('should export eslintConfigJs template', () => {
    expect(files.eslintConfigJs).toBeDefined()
    const result = files.eslintConfigJs.renderString()
    expect(result).toContain('eslintConfig')
    expect(result).toContain('export default')
  })

  it('should export packageJson template', () => {
    expect(files.packageJson).toBeDefined()
    const result = files.packageJson.renderString({ libraryName: '@mono/test-lib' })
    expect(result).toContain('@mono/test-lib')
    expect(result).toContain('version')
  })

  it('should export esbuild template', () => {
    expect(files.esbuild).toBeDefined()
    const result = files.esbuild.renderString({})
    expect(result).toContain('import ')
  })

  it('should export readmeMd template', () => {
    expect(files.readmeMd).toBeDefined()
    const result = files.readmeMd.renderString({ libraryName: '@mono/test-lib' })
    expect(result).toContain('# @mono/test-lib')
  })

  it('should export tsconfigJson template', () => {
    expect(files.tsconfigJson).toBeDefined()
    const result = files.tsconfigJson.renderString()
    expect(result).toContain('extends')
  })

  it('should export indexTs template', () => {
    expect(files.indexTs).toBeDefined()
    const result = files.indexTs.renderString()
    expect(typeof result).toBe('string')
  })
})
