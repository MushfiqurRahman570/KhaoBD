const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false, validate: { min: 1, max: 5 } },
  food_rating: { type: DataTypes.DECIMAL(2, 1), allowNull: true },
  service_rating: { type: DataTypes.DECIMAL(2, 1), allowNull: true },
  value_rating: { type: DataTypes.DECIMAL(2, 1), allowNull: true },
  atmosphere_rating: { type: DataTypes.DECIMAL(2, 1), allowNull: true },
  text: { type: DataTypes.TEXT, allowNull: false },
  visited_date: { type: DataTypes.DATEONLY, allowNull: true },
  like_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'reviews' });

module.exports = Review;
