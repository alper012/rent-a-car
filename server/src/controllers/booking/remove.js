const { AppError, Response } = require('../../helpers');
const { Booking, Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    await booking.destroy();
    const vehicle = await Vehicle.findByPk(booking.vehicleId);
    vehicle.isBooked = false;
    await vehicle.save();
    return Response.success(res);
  } catch (error) {
    next(error);
  }
};
