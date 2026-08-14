const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RestaurantCuisine = sequelize.define('RestaurantCuisine', {
  restaurant_id: { type: DataTypes.INTEGER, primaryKey: true },
  cuisine_id: { type: DataTypes.INTEGER, primaryKey: true },
}, { tableName: 'restaurant_cuisines', timestamps: false });

module.exports = RestaurantCuisine;
