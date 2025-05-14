const { AppError, Response } = require('../../helpers');
const { Booking, Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByPk(req.body.vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    if (vehicle.isBooked) {
      throw new AppError('Vehicle is already booked', 400);
    }
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const timeDiff = Math.abs(endDate - startDate);
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const booking = Booking.build({
      userId: req.user.id,
      vehicleId: req.body.vehicleId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalPrice: dayDiff * vehicle.price,
    });
    await booking.save();
    vehicle.isBooked = true;
    await vehicle.save();
    return Response.created(res, booking);
  } catch (error) {
    next(error);
  }
};
