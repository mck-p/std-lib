const Regitery = require('@std-lib/utils/registry')

module.exports = async (ctx) => {
  const users = await Regitery.get('users')

  const data = await users.getById(ctx.params.id)

  return { data }
}