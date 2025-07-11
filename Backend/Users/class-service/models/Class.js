const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
  name: DataTypes.STRING,
  description: DataTypes.STRING
}, { timestamps: true });

module.exports = Class;
