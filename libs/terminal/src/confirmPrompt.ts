import readline from 'readline'

/**
 * Prompts the user to confirm in the terminal.
 */
export async function confirmPrompt(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y')
    })
  })
}
