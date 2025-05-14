const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const { errorHandler } = require('./src/middlewares/');
const sequelize = require('./src/configs/database');
const { initAssociations, Vehicle } = require('./src/models');
const routes = require('./src/routes');

/** Middlewares */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  })
);

/** Apply the rate limiting middleware to all requests */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
      res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    },
  })
);

/** Initalize Relations */
initAssociations();

/** Routes */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

routes(app);

/** Error Handler */
app.use(errorHandler);

const cars = [
  {
    brand: 'Audi',
    model: 'A4',
    year: 2015,
    priceADay: 400,
    seats: 5,
    power: 190,
    fuelType: 'Diesel',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?audi',
  },
  {
    brand: 'Mercedes',
    model: 'GLA',
    year: 2020,
    priceADay: 550,
    seats: 5,
    power: 211,
    fuelType: 'Gasoline',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?mercedes-gla',
  },
  {
    brand: 'BMW',
    model: 'X5',
    year: 2019,
    priceADay: 650,
    seats: 5,
    power: 265,
    fuelType: 'Diesel',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?bmw-x5',
  },
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2016,
    priceADay: 300,
    seats: 5,
    power: 178,
    fuelType: 'Gasoline',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?toyota-camry',
  },
  {
    brand: 'Honda',
    model: 'Civic',
    year: 2017,
    priceADay: 280,
    seats: 5,
    power: 158,
    fuelType: 'Gasoline',
    transmission: 'manual',
    image: 'https://source.unsplash.com/featured/?honda-civic',
  },
  {
    brand: 'Ford',
    model: 'Focus',
    year: 2014,
    priceADay: 250,
    seats: 5,
    power: 150,
    fuelType: 'Gasoline',
    transmission: 'manual',
    image: 'https://source.unsplash.com/featured/?ford-focus',
  },
  {
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2018,
    priceADay: 320,
    seats: 5,
    power: 140,
    fuelType: 'Gasoline',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?volkswagen-golf',
  },
  {
    brand: 'Opel',
    model: 'Astra',
    year: 2015,
    priceADay: 260,
    seats: 5,
    power: 136,
    fuelType: 'Diesel',
    transmission: 'manual',
    image: 'https://source.unsplash.com/featured/?opel-astra',
  },
  {
    brand: 'Volvo',
    model: 'XC60',
    year: 2021,
    priceADay: 700,
    seats: 5,
    power: 250,
    fuelType: 'Gasoline',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?volvo-xc60',
  },
  {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2022,
    priceADay: 900,
    seats: 5,
    power: 283,
    fuelType: 'Electric',
    transmission: 'auto',
    image: 'https://source.unsplash.com/featured/?tesla-model3',
  },
];

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log('Database connected!');
  //Vehicle.bulkCreate(cars);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
