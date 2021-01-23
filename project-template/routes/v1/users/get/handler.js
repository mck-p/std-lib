const Registry = require('@std-lib/utils/registry')

module.exports = async (ctx) => {
  const users = await Registry.get('users')
  const queues = await Registry.get('queues')
  
  const event = {
    type: 'USERS::LIST',
    timestamps: { sent_at: new Date().toISOString() }
  }

  await queues.events.add(Event)

  return {
    data: await users.list(),
    status: 200,
    headers: {
      'X-Joke': 'My life',
    },
    meta: {
      links: {
        self: ctx.path,
      },
    },
  }
}