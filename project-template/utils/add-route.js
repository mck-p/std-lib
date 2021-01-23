const { Validator } = require('jsonschema')
const validator = new Validator()

validator.attributes.default = (instance, schema, options, ctx) => {
  console.log(instance, schema, options, ctx)
  return
}

module.exports = ({ schema, config, router }) => {
  /**
   * take in route schema and root config,
   * add all middleware, validation, authentication, etc
   */
  const middleware = []

  // if we have feature_flags to worry about
  if (schema.config.feature_flags?.length) {
    middleware.push(async (ctx, next) => {
      // Every feature flag in our config
      const all_match = schema.config.feature_flags.every(({ name, is_on }) =>
        // Must match some root feature flag and be on
        config.feature_flags.some((ff) => {
          if (ff.name === name) {
            return ff.is_on === is_on
          }

          return false
        })
      )

      if (!all_match) {
        return
      }

      return next()
    })
  }

  // if we have some query we are going to use
  if (schema.config.inputs) {
    // TODO: implement header verification
    if (schema.config.inputs.headers) {
    }

    // TODO: implement body verification
    if (schema.config.inputs.body) {
      middleware.push(async (ctx, next) => {
        try {
          await validator.validate(
            ctx.request.body,
            {
              type: 'object',
              properties: schema.config.inputs.body,
            },
            { throwAll: true, throwError: true }
          )

          return next()
        } catch (e) {
          const err = new Error(e.stack)

          err.statusCode = 400
          throw err
        }
      })
    }

    // TODO: implement query verification
    if (schema.config.inputs.query) {
      middleware.push(async (ctx, next) => {
        try {
          await validator.validate(
            ctx.query,
            {
              type: 'object',
              properties: schema.config.inputs.query,
            },
            { throwAll: true, throwError: true }
          )
          

          return next()
        } catch (e) {
          const err = new Error(e.stack)

          err.statusCode  = 400
          throw err
        }
      })
    }
  }

  router[schema.method](schema.path, ...middleware, async (ctx) => {
    const { data, meta, status, headers } = await schema.handler(ctx)

    ctx.status = status || 200
    ctx.set(headers)

    ctx.body = {
      meta,
      data,
    }
  })
}
