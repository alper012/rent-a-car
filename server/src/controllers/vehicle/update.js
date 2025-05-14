const { AppError, Response } = require('../../helpers');
const { Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    await vehicle.update(req.body);
    Response.updated(res, vehicle);
  } catch (error) {
    next(error);
  }
};
