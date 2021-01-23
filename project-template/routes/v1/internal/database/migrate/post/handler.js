const Registry = require('@std-lib/utils/registry')
const compose = require('koa-compose')
const middleware = require('@std-lib/middleware')

module.exports = compose([
  middleware.is_overlord,
  async (ctx) => {
    const db = await Registry.get('database')

    const migrated = await db.migrate.latest()

    return {
      data: migrated,
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
  },
])