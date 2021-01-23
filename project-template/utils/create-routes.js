const fs = require('fs/promises')
const yml = require('js-yaml')
const parse_routes = require('./parse-routes')
const Router = require('@koa/router')
const add_route = require('@std-lib/utils/add-route')

module.exports = async (root_dir) =>  {
  const config = yml.load(await fs.readFile(`${root_dir}/koios.yml`, 'utf8'))

  const routes = await parse_routes(`${root_dir}/${config.routes || 'routes'}`)
  const router = new Router()

  for (const schema of routes) {
    await add_route({
      schema,
      config,
      router
    })
  }

  return {
    config,
    routes,
    router,
  }
}
