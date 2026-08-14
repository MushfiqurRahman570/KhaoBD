const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Restaurant = sequelize.define('Restaurant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name_en: { type: DataTypes.STRING(200), allowNull: false },
  name_bn: { type: DataTypes.STRING(200), allowNull: true },
  description_en: { type: DataTypes.TEXT, allowNull: true },
  description_bn: { type: DataTypes.TEXT, allowNull: true },
  area_id: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING(500), allowNull: false },
  lat: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  lng: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  price_range: {
    type: DataTypes.ENUM('$', '$$', '$$$', '$$$$'),
    allowNull: false,
    defaultValue: '$$',
  },
  opening_hours: { type: DataTypes.STRING(255), allowNull: true },
  avg_rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false, defaultValue: 0 },
  review_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  cover_photo_url: { type: DataTypes.STRING(500), allowNull: true },
}, { tableName: 'restaurants' });

module.exports = Restaurant;
