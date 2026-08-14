const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReviewLike = sequelize.define('ReviewLike', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  review_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'review_likes',
  indexes: [{ unique: true, fields: ['review_id', 'user_id'] }],
});

module.exports = ReviewLike;
