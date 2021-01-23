module.exports = async (ctx) => ({
  data: await Promise.resolve({ id: 1 }),
  status: 200,
  headers: {
    'X-Joke': 'My life',
  },
  meta: {
    links: {
      self: ctx.path,
    },
  },
})