const { DataTypes } = require('sequelize'); // DataTypes, veritabanina uygun veri tiplerini barindiran bir objedir.

const sequelize = require('../configs/database');

const User = sequelize.define('User', { //Tablo adi: User
  id: { //Sutun isimleri ve detaylar
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
