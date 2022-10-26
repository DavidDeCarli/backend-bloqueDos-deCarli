const path = require('node:path');

module.exports = {
    mariaDB: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            database: 'ecommerce'
        }
    },
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: path.resolve(__dirname, './../../../DavidSQLite.db'),
        }
    }
};


// Migraciones
// CREATE TABLE ecommerce 

module.exports.up = async function(knex) {
    const exist = await knex.schema.hasTable('users');
    // await knex.insert y poner la data que querramos agregar
    if (!exist) {
        return knex.schema.createTable('users', (table) => {
            table.increments('id'); // Así definimos nuestra Primary Key
            table.string('name', 255).notNullable().defaultTo('Fulano');
            table.string('lastname');
            table.integer('age');
            table.string('dni').notNullable().unique();
        });
    }
};

// Eliminar tabla

module.exports.down = async function(knex) {
    const exist = await knex.schema.hasTable('users');
    if (exist) {
        return knex.schema.dropTable('ecommerce');
    }
};