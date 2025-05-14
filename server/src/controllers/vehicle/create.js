const { AppError, Response } = require('../../helpers');
const { Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const vehicle = Vehicle.build(req.body);
    await vehicle.save();
    Response.created(res, vehicle);
  } catch (error) {
    next(error);
  }
};
