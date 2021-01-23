const getenv = require('getenv')

module.exports.node_env = () => getenv.string('NODE_ENV', 'development')

module.exports.cache_host = () => getenv.string('CACHE_HOST')
module.exports.cache_port = () => getenv.int('CACHE_PORT')
module.exports.cache_password = () => getenv.string('CACHE_PASSWORD')

module.exports.db_host = () => getenv.string('DB_HOST')
module.exports.db_port = () => getenv.string('DB_PORT')
module.exports.db_user = () => getenv.string('DB_USER')
module.exports.db_password = () => getenv.string('DB_PASSWORD')
module.exports.db_schema = () => getenv.string('DB_SCHEMA')

module.exports.log_level = () => getenv.string('LOG_LEVEL')
module.exports.app_name = () => getenv.string('APP_NAME')
module.exports.app_port = () => getenv.int('APP_PORT')

module.exports.overlord_token = () => getenv.string('OVERLORD_TOKEN')