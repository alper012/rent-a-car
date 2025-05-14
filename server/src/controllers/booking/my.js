const { Response } = require('../../helpers');
const { Booking, Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const user = req.user;
    const bookings = await Booking.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Vehicle,
        },
      ],
    });
    return Response.success(res, bookings);
  } catch (error) {
    next(error);
  }
};
