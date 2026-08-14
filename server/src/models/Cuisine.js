const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cuisine = sequelize.define('Cuisine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name_en: { type: DataTypes.STRING(100), allowNull: false },
  name_bn: { type: DataTypes.STRING(100), allowNull: false },
}, { tableName: 'cuisines' });

module.exports = Cuisine;
