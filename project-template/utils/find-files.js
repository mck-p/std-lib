const glob = require('glob')

module.exports = (pattern, opts) => new Promise((happy, sad) => {
  glob(pattern, opts, (err, data) => {
    if(err) {
      return sad(err)
    } else {
      happy(data)
    }
  })
})