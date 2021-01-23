const Registry = require('@std-lib/utils/registry')
const compose = require('koa-compose')
const middleware = require('@std-lib/middleware')

module.exports = compose([
  middleware.is_overlord,
  async (ctx) => {
    const users = await Registry.get('users')
    const queues = await Registry.get('queues')
    const data = await users.create(ctx.request.body)

    const event = {
      type: 'USERS::NEW',
      payload: data,
      timestamps: { sent_at: new Date().toISOString() }
    }

    await queues.admin_tasks.add(event)

    return {
      data,
      status: 201,
      meta: {
        links: {
          self: ctx.path,
        },
      },
    }
  },
])
