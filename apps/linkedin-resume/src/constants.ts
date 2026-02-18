import fs from 'fs-extra'
import { getAppDataPath } from '@mono/os'

export const CONFIG_PATH = getAppDataPath('bemoje', 'linkedin-resume', 'config.json')
export const DIST_PATH = getAppDataPath('bemoje', 'linkedin-resume', 'dist')
export const CHROME_PROFILE_PATH = getAppDataPath('bemoje', 'linkedin-resume', '.chrome-profile')

fs.ensureDirSync(DIST_PATH)
