const { Response } = require('../../helpers');
const { Vehicle } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAll();
    Response.success(res, vehicles);
  } catch (error) {
    next(error);
  }
};
