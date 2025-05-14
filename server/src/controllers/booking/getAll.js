const { Response } = require('../../helpers');
const { Booking, User, Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [User, Vehicle],
      order: [['createdAt', 'DESC']],
    });
    return Response.success(res, bookings);
  } catch (error) {
    next(error);
  }
};
