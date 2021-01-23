module.exports.DuplicateColumn = class DuplicateColumnError extends Error {
  static isError(err) {
    return (
      err.message.indexOf('duplicate key value violates unique constraint') >= 0
    )
  }

  constructor(err, type) {
    super()
    const trigger = 'duplicate key value violates unique constraint'
    const index = err.message.indexOf(trigger)

    const constraint = err.message.slice(index + trigger.length + 1)

    this.message = `Oops! I can't create that due to the unique ${constraint
      .replace(`${type}_`, '')
      .replace('_unique', '')} constraint. Please change it and try your request again.`

    this.statusCode = 400
  }
}
