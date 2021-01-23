const Registry = new Map()

module.exports.register = (id, service) => {
  Registry.set(id, service)
}

module.exports.register_hashes = (...hashes) => {
  for (const hash of hashes) {
    for (const [id, value] of Object.entries(hash)) {
      this.register(id, value)
    }
  }
}

module.exports.unregister = (id) => {
  Registry.delete(id)
}

module.exports.get = id => Registry.get(id)

module.exports.connect = async () => {
  const results = await Promise.all([...Registry.entries()].map(async ([id, { connect }]) => [id, await connect()]))
  for (const [id, service] of results) {
    this.register(id, service)
  }
}

module.exports.disconnect = async () => {
  await Promise.all([
    ...Registry.values().map(({ disconnect }) => disconnect()),
  ])
}
