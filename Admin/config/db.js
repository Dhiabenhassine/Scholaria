const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Scholaria', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
