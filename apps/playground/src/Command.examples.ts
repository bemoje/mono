import { Command } from '@mono/node'

// Example usage demonstrating the fluent API and type safety
const cmd = new Command('do', '1.0.0', 'a command line tool')
  .argument('<user>', 'user name')
  .argument('<files...>', 'input files')
  .option('-V, --verbose', 'enable verbose mode')
  .option('-D, --debug', 'enable debug mode')
  .option('-t, --tags <tags...>', 'list of tags')
  .option('-o, --out <dir>', 'output files location')
console.log(cmd)
console.log(cmd.parse(['bmj', 'input1.txt', 'input2.txt', '-V', '-o', 'myoutdir']))
