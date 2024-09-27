const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Car;
