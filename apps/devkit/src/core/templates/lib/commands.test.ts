import { commands } from './commands'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe('template commands', () => {
  it('should export addDependency template', () => {
    expect(commands.addDependency).toBeDefined()
    const result = commands.addDependency.renderString({ dependency: 'lodash' })
    expect(result).toBe('yarn add lodash')
  })

  it('should export addDevDependency template', () => {
    expect(commands.addDevDependency).toBeDefined()
    const result = commands.addDevDependency.renderString({ dependency: 'vitest' })
    expect(result).toBe('yarn add vitest -D')
  })

  it('should export removeDependency template', () => {
    expect(commands.removeDependency).toBeDefined()
    const result = commands.removeDependency.renderString({ workspace: '@mono/test', dependency: 'lodash' })
    expect(result).toBe('yarn workspace @mono/test remove lodash')
  })

  it('should export openFileInIDE template', () => {
    expect(commands.openFileInIDE).toBeDefined()
    const result = commands.openFileInIDE.renderString({ filepath: '/some/file.ts' })
    expect(result).toBe('code /some/file.ts')
  })
})
