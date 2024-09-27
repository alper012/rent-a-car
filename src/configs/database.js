const { Sequelize } = require('sequelize'); //destructuring assignment yontemiyle Sequielize class'ını import eder
require('dotenv').config(); // .env dosyasındaki bilgileri process.env nesnesine ekler.

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false }); //kullanici adi - sifre- bu adresteki db'e baglanmak istiyorum ve veritabani adini yaziyorum

module.exports = sequelize;
