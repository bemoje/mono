export function clearTerminal() {
  if (process.env.NODE_ENV !== 'test') {
    return process.stdout.write('\u001Bc')
  }
}
