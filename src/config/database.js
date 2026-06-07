const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log(process.env.MYSQL_ADDON_HOST);
console.log(process.env.MYSQL_ADDON_DB);

const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB,
  process.env.MYSQL_ADDON_USER,
  process.env.MYSQL_ADDON_PASSWORD,
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;