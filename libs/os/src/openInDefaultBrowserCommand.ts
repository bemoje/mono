import { getDefaultBrowserWindows } from './getDefaultBrowserWindows'
import { getOS } from './getOS'

/**
 * Gets the command to open a URL in the default browser for the current operating system.
 */
export function openInDefaultBrowserCommand(url?: string): string {
  const OS = getOS()
  let run
  switch (OS) {
  case 'windows': {
    run = getDefaultBrowserWindows().run
  
  break;
  }
  case 'osx': {
    run = 'open safari'
  
  break;
  }
  case 'linux': {
    run = 'xdg-open'
  
  break;
  }
  default: {
    throw new Error(`Unknown OS: ${OS}`)
  }
  }
  return url ? `${run} "${url}"` : run
}
