import { execSync } from 'child_process'

/**
 * Gets the default browser identifier on Windows by querying the registry.
 */
export function getDefaultBrowserWindows() {
  const result = execSync(
    'reg ' +
      [
        'QUERY',
        ' HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice',
        '/v',
        'ProgId',
      ].join(' '),
  )
  const match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(result.toString())
  if (!match || !match.groups) {
    throw new Error(`Cannot find Windows browser in stdout: ${result.toString()}`)
  }
  const { id } = match.groups
  const browser = windowsBrowserProgIds[id]
  if (!browser) {
    throw new Error(`Unknown browser ID: ${id}`)
  }
  return browser
}
const windowsBrowserProgIds: Record<string, { name: string; run: string; id: string }> = {
  'AppXq0fevzme2pys62n3e0fbqa7peapykr8v': { name: 'Edge', run: 'msedge', id: 'com.microsoft.edge.old' },
  'MSEdgeDHTML': { name: 'Edge', run: 'msedge', id: 'com.microsoft.edge' },
  'MSEdgeHTM': { name: 'Edge', run: 'msedge', id: 'com.microsoft.edge' },
  'IE.HTTP': { name: 'Internet Explorer', run: 'iexplore', id: 'com.microsoft.ie' },
  'FirefoxURL': { name: 'Firefox', run: 'firefox', id: 'org.mozilla.firefox' },
  'ChromeHTML': { name: 'Chrome', run: 'chrome', id: 'com.google.chrome' },
  'BraveHTML': { name: 'Brave', run: 'brave', id: 'com.brave.Browser' },
  'BraveBHTML': { name: 'Brave Beta', run: 'brave', id: 'com.brave.Browser.beta' },
  'BraveSSHTM': { name: 'Brave Nightly', run: 'brave', id: 'com.brave.Browser.nightly' },
}
