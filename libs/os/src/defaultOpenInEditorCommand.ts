import { isOSX } from './isOSX'
import { isVsCodeInstalled } from './isVsCodeInstalled'
import { isWindows } from './isWindows'

/**
 * Get the default command to open a file in in a text editor.
 * If VSCode is installed, this is used. Otherwise, the default text editor of the OS is used.
 */
export function defaultOpenInEditorCommand() {
  if (!COMMAND)
    COMMAND = isVsCodeInstalled() ? 'code -w' : isWindows() ? 'notepad' : isOSX() ? 'open vi' : 'xdg-open'
  return COMMAND
}

let COMMAND = ''
