const configure = require('@std-lib/config/set-env')
const registry = require('@std-lib/utils/registry')
const Infrastructure = require('@std-lib/infrastructure')
const Services = require('@std-lib/services')
const Repositories = require('@std-lib/repositories')

const register_and_start_backing_services = async () => {
  // First we need to register our _things_
  await registry.register_hashes(Infrastructure, Services, Repositories)
  // Then we connect the things
  await registry.connect()
}

const handle_shutdown = (reason) => async (err) => {
  const log = registry.get('log')
  log.info({ err }, `We are shutting down due to ${reason}`)

  await registry.disconnect()

  log.fatal({ err, reason }, 'Shutting down')

  process.exit(err ? 1 : 0)
}

const attach_to_process = () => {
  process.on('uncaughtException', handle_shutdown('Uncaught Exception'))
  process.on('unhandledRejection', handle_shutdown('Unahndled Rejection'))
}

const start_workers = async () => {
  const queues = await registry.get('queues')

  queues.admin_tasks.process(async job => {
    console.log('I am processing a very import job for the Admin!', job)

    return true
  })

  queues.events.process(async (job) => {
    console.log('I am processing an event that might tell us information in an async way', job)

    return true
  })
}

const main = async () => {
  const log = registry.get('log')

  log.trace('System Has Started!')
}

configure()
  .then(register_and_start_backing_services)
  .then(main)
  .then(start_workers)
  .then(attach_to_process)
