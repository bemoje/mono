import 'dotenv/config'
import { setTimeout } from 'timers/promises'

void (async () => {
  const recipient =
    JSON.parse(process.env.BREVO_CONTACTS || '{}')[(process.argv[2] ?? '').toLowerCase()] ?? process.argv[2]

  const content = process.argv.slice(3).join('\n')

  if (!recipient || !content) {
    console.log('Got:', process.argv.slice(2))
    console.error('ERROR')
    console.error('Usage: SMS <recipient> <lines...>')
    process.exit(1)
  }

  const response1 = await fetch('https://api.brevo.com/v3/transactionalSMS/send', {
    method: 'post',
    headers: {
      'api-key': process.env.BREVO_API_KEY ?? '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: 'Benjamin',
      recipient,
      content,
      tag: 'SMS',
      type: 'marketing',
      unicodeEnabled: true,
    }),
  })

  const data1 = await response1.json()
  const messageId = data1.messageId
  console.log({ messageId })

  await setTimeout(5000)

  const response2 = await fetch(
    'https://api.brevo.com/v3/transactionalSMS/statistics/events?limit=1&offset=0&sort=desc',
    {
      method: 'get',
      headers: {
        'api-key': process.env.BREVO_API_KEY ?? '',
        'Accept': 'application/json',
      },
    }
  )
  const data2 = await response2.json()
  const events = data2.events
  const event = events?.[0]
  console.log({ event })

  if (!event || Number(event.messageId) !== messageId) {
    console.error('ERROR: LATEST MESSAGE NOT EXPECTED MESSAGE ID')
  }
})()
