const start = Date.now()
const Registry = require('@std-lib/utils/registry')

module.exports = async (ctx) => {
  const db = await Registry.get('database')
  const cache = await Registry.get('cache')
  const db_healthy = await db.is_healthy()
  const cache_healthy = await cache.is_healthy()

  const health = `DB Healthy: ${db_healthy} :: Cache Healthy: ${cache_healthy}`

  const is_healthy = db_healthy && cache_healthy

  if (!is_healthy) {
    const err = new Error(health)
    err.statusCode = 500

    throw err
  }

  return {
    data: {
      uptime: Date.now() - start,
    },
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