const Redis = require('ioredis')
const Env = require('../config/env')

let client

module.exports.connect = () => {
  if (!client) {
    client = new Redis({
      port: Env.cache_port(),
      host: Env.cache_host(),
      password: Env.cache_password(),
    })

    client.is_healthy = () => client.ping().then(() => true).catch(() => false)
  }

  return client
}

module.exports.disconnect = async () => {
  if (client) {
    await client.disconnect()

    client = null
  }
}
