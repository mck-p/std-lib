const Knex = require('knex')
const default_config = require('../knexfile')
const Env = require('../config/env')

let client

module.exports.connect = () => {
  if (!client) {
    client = Knex({
      ...default_config,
      connection: {
        user: Env.db_user(),
        password: Env.db_password(),
        host: Env.db_host(),
        port: Env.db_port(),
        database: Env.db_schema(),
      },
      debug: true,
    })

    client.is_healthy = () => client.raw(`SELECT NOW()`).then(() => true).catch(() => false)
  }

  return client
}

module.exports.disconnect = async () => {
  if (client) {
    await client.destroy()
    client = null
  }
}
