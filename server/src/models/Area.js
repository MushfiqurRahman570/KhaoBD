const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Area = sequelize.define('Area', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name_en: { type: DataTypes.STRING(100), allowNull: false },
  name_bn: { type: DataTypes.STRING(100), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
}, { tableName: 'areas' });

module.exports = Area;
