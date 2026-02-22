export * from './defaultOpenInEditorCommand'
export * from './getAppDataPath'
export * from './getDefaultBrowserWindows'
export * from './getHomeDirectory'
export * from './getOS'
export * from './getTempDataPath'
export * from './getTempFilepath'
export * from './isLinux'
export * from './isLinuxProgramInstalled'
export * from './isOSX'
export * from './isVsCodeInstalled'
export * from './isWindows'
export * from './openInDefaultBrowserCommand'
export * from './winExplorerOpenDirectory'

import * as MODULE_01 from './defaultOpenInEditorCommand'
import * as MODULE_02 from './getAppDataPath'
import * as MODULE_03 from './getDefaultBrowserWindows'
import * as MODULE_04 from './getHomeDirectory'
import * as MODULE_05 from './getOS'
import * as MODULE_06 from './getTempDataPath'
import * as MODULE_07 from './getTempFilepath'
import * as MODULE_08 from './isLinux'
import * as MODULE_09 from './isLinuxProgramInstalled'
import * as MODULE_10 from './isOSX'
import * as MODULE_11 from './isVsCodeInstalled'
import * as MODULE_12 from './isWindows'
import * as MODULE_13 from './openInDefaultBrowserCommand'
import * as MODULE_14 from './winExplorerOpenDirectory'

export default {
  ...MODULE_01, //
  ...MODULE_02,
  ...MODULE_03,
  ...MODULE_04,
  ...MODULE_05,
  ...MODULE_06,
  ...MODULE_07,
  ...MODULE_08,
  ...MODULE_09,
  ...MODULE_10,
  ...MODULE_11,
  ...MODULE_12,
  ...MODULE_13,
  ...MODULE_14,
}
