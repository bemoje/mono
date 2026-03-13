import onetime from 'onetime'

export const onExit = (() => {
  const callbacks = new Set<NodeJS.ExitListener>()

  const onExit = onetime((code: number) => {
    callbacks.forEach((fn) => {
      fn(code)
    })
    process.exit(128 + code)
  })
  const onSigTerm = onExit.bind(null, 15)
  const onSigInt = onExit.bind(null, 2)

  return (callback: NodeJS.ExitListener) => {
    if (callbacks.size === 0) {
      process.once('SIGTERM', onSigTerm)
      process.once('SIGINT', onSigInt)
      process.once('exit', onExit)
    }
    callbacks.add(callback)

    return () => {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        process.off('SIGTERM', onSigTerm)
        process.off('SIGINT', onSigInt)
        process.off('exit', onExit)
      }
    }
  }
})()

// ---------

console.log('Start')
setTimeout(() => {
  console.log('Done')
}, 2000)

// ---------

onExit((code) => {
  if (code > 1) {
    console.log({ code })
  }
})
