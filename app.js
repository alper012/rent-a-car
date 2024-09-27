const express = require('express');
const app = express();
const dotenv = require('dotenv'); //dotenv, Node.js projelerinde çevresel değişkenleri kolayca yönetmek için kullanılan bir kütüphanedir.
dotenv.config(); // config fonksiyonu .env dosyasındaki bilgileri process.env nesnesine ekler.

const User = require('./src/models/User'); // sequielize'in calismasi icin modellerin import edilmesi gerek
const Car = require('./src/models/Car');
const Booking = require('./src/models/Booking');

const sequelize = require('./src/configs/database'); //Veritabani baglantisi
const carRoute = require('./src/routes/carRoute');
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');
const bookingRoute = require('./src/routes/bookingRoute');

app.use(express.json()); // JSON alıp JSON vereceksin demek. Bunu koymasaydık req.body undefined olurdu.

app.use('/car', carRoute); // /car route'unu carRoute.js dosyasındaki router ile bağladık.
app.use('/user', userRoute); // userRoute.js dosyasını import edip /user route'unu bağladık.
app.use('/auth', authRoute); // authRoute.js dosyasını import edip /auth route'unu bağladık.
app.use('/booking', bookingRoute); // bookingRoute.js dosyasını import edip /booking route'unu bağladık.

sequelize.sync().then(() => {
  console.log('Database connected!');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
//once veritabanina baglan sonra serveri calistir. sequelize'yi senkronize et demek
