import { describe } from 'vitest'
import { eslintPluginBemoje } from './eslintPluginBemoje'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(eslintPluginBemoje.name, () => {
  it('should return plugin with meta, rules, and configs', () => {
    const plugin = eslintPluginBemoje()
    expect(plugin.meta.name).toBe('eslint-plugin-bemoje')
    expect(plugin.meta.version).toBe('1.0.1')
    expect(plugin.rules).toHaveProperty('no-blank-line-between-comment-and-declaration')
  })

  it('should return recommended config via getter', () => {
    const plugin = eslintPluginBemoje()
    const recommended = plugin.configs.recommended
    expect(recommended).toHaveProperty('plugins')
    expect(recommended).toHaveProperty('rules')
  })

  it('should return plugin recursively via plugins getter', () => {
    const plugin = eslintPluginBemoje()
    const recommended = plugin.configs.recommended
    const inner = recommended.plugins['eslint-plugin-bemoje']
    expect(inner.meta.name).toBe('eslint-plugin-bemoje')
  })
})
