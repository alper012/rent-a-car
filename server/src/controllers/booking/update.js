const { AppError, Response } = require('../../helpers');
const { Booking, Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [Vehicle],
    });
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    booking.status = req.body.status;
    await booking.save();
    if (booking.status === 'REJECTED') {
      const vehicle = await Vehicle.findByPk(booking.vehicle.id);
      vehicle.isBooked = false;
      await vehicle.save();
    }
    return Response.success(res, booking);
  } catch (error) {
    next(error);
  }
};
