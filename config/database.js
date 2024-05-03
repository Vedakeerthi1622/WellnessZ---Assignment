// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('NewDB', 'Vedakeerthi', 'Veda@5118', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
