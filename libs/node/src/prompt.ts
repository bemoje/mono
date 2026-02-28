import readline from 'readline'

/**
 * Prompt the user for input.
 * @param question - The question to ask the user.
 * @param callback - A callback function. If it returns an empty string, the user is prompted again. Print any desired error messages to user inside the callback function. If the callback does not return an empty string, that string is returned.
 */
export async function prompt(question: string, callback?: (input: string) => string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let answer = ''
  while (!answer) {
    answer = await new Promise((resolve) => {
      rl.question(question, (input: string) => {
        if (!callback) {
          resolve(input.trim())
        } else {
          resolve(callback(input.trim()))
        }
      })
    })
  }
  rl.close()
  return answer
}
