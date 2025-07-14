/**
 * Checks if the current platform is Windows.
 * @remarks
 * It checks the 'process' object and the 'platform' property to determine if the platform is 'win32'.
 * It also checks the 'OSTYPE' environment variable to see if it matches 'msys' or 'cygwin'.
 * @returns A boolean indicating whether the current platform is Windows.
 */
export function isWindows(): boolean {
  if (isWin === undefined) {
    isWin = process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env['OSTYPE'] || ''))
  }
  return isWin
}

let isWin: boolean | undefined = undefined
