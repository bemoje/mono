import commandExists from 'command-exists'

const res = await commandExists('git')
console.log(res)
