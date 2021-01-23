const find_files = require('@std-lib/utils/find-files')
const R = require('ramda')
const yml = require('js-yaml')
const fs = require('fs/promises')

const allowed_methods = ['get', 'post', 'put', 'patch', 'delete']

module.exports = async (folder_path) => {
  const config_file_paths = await find_files(
    `${folder_path}/**/@(${allowed_methods.join('|')})/config.yml`,
    { nonull: false }
  )

  const configs_raw = await Promise.all(
    config_file_paths.map((file) => fs.readFile(file))
  )
  const configs = configs_raw.map(yml.load)

  const handlers = config_file_paths.map((config_path) =>
    require(config_path.replace(`/config.yml`, '/handler.js'))
  )

  const mixed = R.zip(
    config_file_paths
      .map((file_path) => file_path.replace(folder_path, '').replace('/config.yml', ''))
      .map(file_path => {
        const list = file_path.split('/')
        const method = list.pop()

        return [list.join('/'), method]
      }),
    R.zip(configs, handlers)
  )

  return R.reduce(
    (acc, [[path, method], [config, handler]]) =>
      R.append({ path, method, config, handler }, acc),
    [],
    mixed
  )
}
