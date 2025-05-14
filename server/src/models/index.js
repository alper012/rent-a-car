const Booking = require('./booking.model');
const User = require('./user.model');
const Vehicle = require('./vehicle.model');

const initAssociations = () => {
  Booking.belongsTo(User, { foreignKey: 'userId' });
  Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

  Vehicle.hasMany(Booking, { foreignKey: 'vehicleId' });

  User.hasMany(Booking, { foreignKey: 'userId' });
};

const models = { Booking, User, Vehicle };

module.exports = { initAssociations, ...models };
