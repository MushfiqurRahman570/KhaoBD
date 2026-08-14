const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MenuItem = sequelize.define('MenuItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  name_en: { type: DataTypes.STRING(150), allowNull: false },
  name_bn: { type: DataTypes.STRING(150), allowNull: true },
  description_en: { type: DataTypes.STRING(500), allowNull: true },
  description_bn: { type: DataTypes.STRING(500), allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: true }, // e.g. Starters, Main, Dessert, Drinks
  photo_url: { type: DataTypes.STRING(500), allowNull: true },
  is_popular: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'menu_items' });

module.exports = MenuItem;
