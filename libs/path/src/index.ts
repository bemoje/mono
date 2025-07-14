export * from 'upath'
export * from './lib/cwd'
export * from './lib/isUnc'
export * from './lib/dirnameDeep'
export * from './lib/isRelative'
export * from './lib/root'
export * from './lib/suffixFilename'
export * from './lib/prefixFilename'
export * from './lib/toCwdRelative'
export * from './lib/isValidWin32'
export * from './lib/toWin32'
export * from './lib/hasBasename'
export * from './lib/hasExtname'
export * from './lib/hasExtnamePrefix'
export * from './lib/hasParentDirname'
export * from './lib/SemanticExtnamePrefix'

import * as upath from 'upath'
import * as cwd from './lib/cwd'
import * as isUnc from './lib/isUnc'
import * as dirnameDeep from './lib/dirnameDeep'
import * as isRelative from './lib/isRelative'
import * as root from './lib/root'
import * as suffixFilename from './lib/suffixFilename'
import * as prefixFilename from './lib/prefixFilename'
import * as toCwdRelative from './lib/toCwdRelative'
import * as isValidWin32 from './lib/isValidWin32'
import * as toWin32 from './lib/toWin32'
import * as hasBasename from './lib/hasBasename'
import * as hasExtname from './lib/hasExtname'
import * as hasExtnamePrefix from './lib/hasExtnamePrefix'
import * as hasParentDirname from './lib/hasParentDirname'
import * as SemanticExtnamePrefix from './lib/SemanticExtnamePrefix'

/**
 * An extenstion of `upath` which is a drop-in replacement / proxy to nodejs's `path`.
 * @see upath replaces the windows `\` with the unix `/` in all string params & results.
 *
 * @remarks
 * Normal `path` doesn't convert paths to a unified format (ie `/`) before calculating paths (`normalize`, `join`), which can lead to numerous problems.
 * Also path joining, normalization etc on the two formats is not consistent, depending on where it runs. Running `path` on Windows yields different results than when it runs on Linux / Mac.
 * In general, if you code your paths logic while developing on Unix/Mac and it runs on Windows, you may run into problems when using `path`.
 * Note that using **Unix `/` on Windows** works perfectly inside nodejs (and other languages), so there's no reason to stick to the Windows legacy at all.
 * More details in the upath docs @see https://github.com/anodynos/upath
 */
const api = {
  ...upath,
  ...cwd,
  ...dirnameDeep,
  ...hasBasename,
  ...hasExtname,
  ...hasExtnamePrefix,
  ...hasParentDirname,
  ...isUnc,
  ...isRelative,
  ...root,
  ...suffixFilename,
  ...prefixFilename,
  ...toCwdRelative,
  ...isValidWin32,
  ...toWin32,
  ...SemanticExtnamePrefix,
}

export default api
