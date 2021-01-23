const Registry = require('@std-lib/utils/registry')

module.exports = async (ctx, next) => {
  const secrets = await Registry.get('secrets')

  const token = ctx.headers.authorization?.replace('Bearer ', '')

  if (token !== (await secrets.overlord_token())) {
    const err = new Error('You must be my overlord to perform that task. Sorry!')
    err.statusCode = 401
    throw err
  }

  return next()
}