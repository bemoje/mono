import fs from 'fs'
import { prompt } from '../src/prompt/prompt'

async function main() {
  await prompt
    .text('What is your  username?') //
    .run()

  await prompt
    .number('How old are you?')
    .validate((value) => {
      return value < 18 ? `Nightclub is 18+ only` : true
    })
    .run()

  await prompt
    .confirm('Can you confirm this is your age?') //
    .initial(true)
    .run()

  await prompt
    .password('Enter password') //
    .run()

  await prompt
    .invisible('This is invisible') //
    .initial('secret')
    .run()

  await prompt
    .list('Enter some keywords')
    .separator(' ')
    .validate((arr) => {
      return arr.length > 1 ? true : 'Please enter more than one'
    })
    .run()

  await prompt
    .toggle('Toggle Cool Mode') //
    .initial(true)
    .active('on')
    .inactive('off')
    .run()

  await prompt
    .select('Pick a color')
    .choices(['Black', 'Red', 'Green', 'Blue', 'White'])
    .hint('Select your favorite.')
    .warn('Really not a good idea,')
    .run()

  await prompt
    .multiselect('Pick between 1 and 3 colors')
    .choices(['Black', 'Red', 'Green', 'Blue', 'White'])
    .instructions('Here are some instructions')
    .min(1)
    .max(3)
    .hint('Select your favorite.')
    .warn('Really not a good idea,')
    .run()

  await prompt
    .autocomplete('Pick a color') //
    .choices(['Black', 'Red', 'Green', 'Blue', 'White'])
    .run()

  await prompt
    .autocompleteMultiselect('Pick between 1 and 3 colors')
    .choices(['Black', 'Red', 'Green', 'Blue', 'White'])
    .instructions('Here are some instructions')
    .min(1)
    .max(3)
    .hint('Select your favorite.')
    .warn('Really not a good idea,')
    .run()

  await prompt
    .date('Select a date in the future')
    .initial(new Date())
    .validate((date) => {
      return date > new Date() ? true : 'Date must be in the future'
    })
    .run()

  await prompt
    .search('Search for a word in this file') //
    .choices(fs.readdirSync('libs'))
    .filtering({ includes: true, startsWith: true })
    .clearFirst(true)
    .limit(30)
    .separator(' ')
    .run()
}
void main()

// prompt.autocomplete('a').suggest

// prompt
//   .search('Search for a word in this file') //
//   .choices(fs.readdirSync('libs'))
//   .filtering({ includes: true, startsWith: true })
//   .clearFirst(true)
//   .limit(30)
//   .separator(' ')
//   .name('cool')

//   .run()
//   .then((result) => {
//     console.log(result)
//   })
