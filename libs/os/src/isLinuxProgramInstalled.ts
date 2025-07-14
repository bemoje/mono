import { exec } from 'child_process'
import { getOS } from './getOS'

/**
 * LINUX ONLY: Returns whether a program is installed on the system.
 * Always returns false of OS is not linux.
 * @param name - The name of the program to check for.
 */
export function isLinuxProgramInstalled(name: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (getOS() !== 'linux') return resolve(false)
    exec(`which ${name}`, (error) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
