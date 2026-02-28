import type { UserConfig } from './types/UserConfig'
import { createInterface } from 'node:readline/promises'
import { userConfigFile } from './userConfigFile'

export async function loadUserConfig(): Promise<UserConfig> {
  const config = userConfigFile.load()

  if (config.username) {
    return config
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const username = (await rl.question('Enter your LinkedIn username: ')).trim()
  rl.close()

  if (!username) {
    console.error('LinkedIn username is required.')
    process.exit(1)
  }

  return userConfigFile.update((config) => {
    return { ...config, username }
  })
}
