const Registry = require('@std-lib/utils/registry')
const RepositoryErrors = require('./Errors')
const bcrypt = require('bcrypt')

const safe_keys = ['id', 'created_at', 'email', 'updated_at', 'username']

const repository = {
  list: async () => {
    const db = await Registry.get('database')

    return db.from('users').select(safe_keys)
  },
  create: async ({ username, email, password }) => {
    try{
      const hp = await bcrypt.hash(password, 10)
      const db = await Registry.get('database')
    
      const [user] = await db
        .into('users')
        .insert({
          username,
          email,
          password: hp,
        })
        .returning('*')

      delete user.password

      return user
    } catch (e) {
      if (RepositoryErrors.DuplicateColumn.isError(e)) {
        throw new RepositoryErrors.DuplicateColumn(e, 'users')
      }

      throw e
    }
  },
  getById: async (id) => {
    const db = await Registry.get('database')
    
    return db.from('users').where({ id }).select(safe_keys).first()
  }
}

module.exports.connect = () => {
  return repository
}

module.exports.disconnect = () => {}
