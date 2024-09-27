const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./User');
const Car = require('./Car');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

// Booking modelinde User ve Car ile ilişkiler
Booking.belongsTo(User, { foreignKey: 'userId', allowNull: false });
Booking.belongsTo(Car, { foreignKey: 'carId', allowNull: false });

module.exports = Booking;
