const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./User');  // Her oturumun bir kullanıcıya bağlı olduğunu göstermek için

const Auth = sequelize.define('Auth', {
  token: {
    type: DataTypes.STRING,  // Kullanıcıya ait JWT (JSON Web Token) kimlik doğrulama token'ı 
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,  // Token'ı yenilemek için kullanılan bir refresh token
    allowNull: true,
  },
  expiration: {
    type: DataTypes.DATE,  // Token'ın geçerlilik süresi
    allowNull: false,
  },
});

// Bir oturum bir kullanıcıya bağlıdır
Auth.belongsTo(User, { foreignKey: 'userId', allowNull: false });

module.exports = Auth;
