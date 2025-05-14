const express = require('express');
const router = express.Router();

const { validateSchema, verify, isAdmin } = require('../middlewares');
const vehicleController = require('../controllers/vehicle');
const vehicleSchema = require('../schemas/vehicle.schema');

router.post(
  '/',
  verify,
  isAdmin,
  validateSchema(vehicleSchema.create),
  vehicleController.create
);

router.get('/', vehicleController.getAll);

router.get(
  '/:id',
  validateSchema(vehicleSchema.getByIdAndRemove),
  vehicleController.getById
);

router.patch(
  '/:id',
  verify,
  isAdmin,
  validateSchema(vehicleSchema.update),
  vehicleController.update
);

router.delete(
  '/:id',
  verify,
  isAdmin,
  validateSchema(vehicleSchema.getByIdAndRemove),
  vehicleController.remove
);

module.exports = router;
