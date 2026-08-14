const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReviewPhoto = sequelize.define('ReviewPhoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  review_id: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING(500), allowNull: false },
}, { tableName: 'review_photos' });

module.exports = ReviewPhoto;
