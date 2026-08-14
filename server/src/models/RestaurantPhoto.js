const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RestaurantPhoto = sequelize.define('RestaurantPhoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING(500), allowNull: false },
  uploaded_by: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'restaurant_photos' });

module.exports = RestaurantPhoto;
