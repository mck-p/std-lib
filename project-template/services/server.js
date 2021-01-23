const path = require('path')
const Registry = require('@std-lib/utils/registry')
const Env = require('@std-lib/config/env')
const create_routes = require('@std-lib/utils/create-routes')
const Koa = require('koa')
const Headers = require('koa-helmet')
const Cors = require('@koa/cors')
const BodyParser = require('koa-body')
const Router = require('koa-router')
const PinoLogger = require('koa-pino-logger')

const server = new Koa()

const { UI } = require('bull-board')

const queue_admin = new Router({ prefix: '/admin/queues' })

queue_admin.use(async (ctx, next) => {
  console.log('hello?')
  if (ctx.status === 404 || ctx.status === '404') {
    delete ctx.res.statusCode
  }
  ctx.respond = false
  const app = UI('/monitor') // add routing prefix to express app
  app(ctx.req, ctx.res)
})


server
  .use(Headers())
  .use(Cors())
  .use(BodyParser())
  .use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      ctx.status = e.statusCode || e.status || 500
      ctx.body = {
        error: { message: e.message, status: ctx.status },
      }
    }
  })
  .use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      const logger = Registry.get('log')
      logger.error({ err: e })
      throw e
    }
  })
  .use(queue_admin.routes())

module.exports.use = (...args) => server.use(...args)

let instance

module.exports.connect = async () => {
  if (!instance) {
    const { router } = await create_routes(path.resolve(__dirname, '..'))
    const log = await Registry.get('log')
    
    server
    .use(PinoLogger())
    .use(router.routes()).use(router.allowedMethods())

    await new Promise((res) => (instance = server.listen(Env.app_port(), res)))
  }

  return instance
}

module.exports.disconnect = async () => {
  if (instance) {
    await new Promise(res => instance.close(res))
  }

  instance = null
}