import fs from 'fs-extra'
import upath from 'upath'
import { getAppDataPath } from '@mono/os'

export const APPDATA_PATH = getAppDataPath('bemoje', 'linkedin-resume')
export const CONFIG_PATH = upath.joinSafe(APPDATA_PATH, 'config.json')
export const DIST_PATH = upath.joinSafe(APPDATA_PATH, 'dist')
export const SCRAPE_PATH = upath.joinSafe(APPDATA_PATH, 'scrape')
export const CHROME_PROFILE_PATH = upath.joinSafe(APPDATA_PATH, '.chrome-profile')

fs.ensureDirSync(DIST_PATH)
fs.ensureDirSync(SCRAPE_PATH)
