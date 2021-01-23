const Env = require('@std-lib/config/env')
const Pino = require('pino')

let client

module.exports.connect = () => {
  if (!client) {
    client = Pino({
      name: Env.app_name(),
      level: Env.log_level(),
    })
  }

  return client
}

module.exports.disconnect = () => {
  client = null
}
