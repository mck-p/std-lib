/**
 *
 * @param {import('knex')} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    
    table.text('username')
      .unique() 
      .notNullable()

    table.text('email')
      .unique()
      .notNullable()

    table.text('password')
      .notNullable()

    table.timestamps(false, true)
  })
};

/**
 *
 * @param {import('knex')} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
