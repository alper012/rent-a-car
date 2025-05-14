const { AppError } = require('../helpers');
require('dotenv').config();

const routes = [
  {
    path: '/auths',
    router: require('./auth.routes'),
  },
  {
    path: '/vehicles',
    router: require('./vehicle.routes'),
  },
  {
    path: '/bookings',
    router: require('./booking.routes'),
  },
  {
    path: '/users',
    router: require('./user.routes'),
  },
];

module.exports = (app) => {
  routes.forEach((route) => {
    app.use(route.path, route.router);
  });
};
