const { AppError, Response } = require('../../helpers');
const { Booking } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    return Response.success(res, booking);
  } catch (error) {
    next(error);
  }
};
