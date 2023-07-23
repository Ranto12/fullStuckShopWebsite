const Sequelize = require('sequelize');

const db = new Sequelize('db_shop', 'root', 'root', {
    host : "localhost",
    dialect : "mysql"
})

module.exports = db