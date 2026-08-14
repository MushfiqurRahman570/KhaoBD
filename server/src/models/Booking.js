const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING(10), allowNull: false },
  party_size: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
  note: { type: DataTypes.STRING(500), allowNull: true },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, { tableName: 'bookings' });

module.exports = Booking;
