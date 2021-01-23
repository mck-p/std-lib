const Queue = require('bull')
const Env = require('@std-lib/config/env')
const { setQueues, BullAdapter } = require('bull-board')

let queues

module.exports.connect = () => {
  if (!queues) {
    const redis = {
      host: Env.cache_host(),
      port: Env.cache_port(),
      password: Env.cache_password(),
    }

    queues = {
      admin_tasks: new Queue('Admin Tasks', {
        redis,
      }),
      events: new Queue('Events', {
        redis
      })
    }

    setQueues(
      Object.values(queues).map(q => new BullAdapter(q))
    )
  }

  return queues
}

module.exports.disconnect = () => {
  queues = null
}
