import fs from 'fs'

const cov = JSON.parse(fs.readFileSync('.coverage/html/coverage-summary.json', 'utf-8'))

Object.entries(cov)
  .filter(([filename,]) => {
    return filename !== 'total'
  })
  .filter(([_, obj]) => {
    return Object.values(obj).some((o) => o.pct < 100)
  })
  .map(([filename,]) => {
    return filename.replace(/\\+/g, '/').replace('C:/Users/bemoj/repos/mono/', '')
  })
  .forEach((filename) => {
    console.log(filename)
  })
