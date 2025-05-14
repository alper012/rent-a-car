const express = require('express');
const router = express.Router();

const { validateSchema, verify, isAdmin } = require('../middlewares');
const bookingController = require('../controllers/booking');
const bookingSchema = require('../schemas/booking.schema');

router.post(
  '/',
  verify,
  validateSchema(bookingSchema.create),
  bookingController.create
);

router.get('/my', verify, bookingController.my);

router.get('/', verify, isAdmin, bookingController.getAll);

router.get(
  '/:id',
  verify,
  isAdmin,
  validateSchema(bookingSchema.getByIdAndRemove),
  bookingController.getById
);

router.patch(
  '/:id',
  verify,
  isAdmin,
  validateSchema(bookingSchema.update),
  bookingController.update
);

router.delete(
  '/:id',
  verify,
  isAdmin,
  validateSchema(bookingSchema.getByIdAndRemove),
  bookingController.remove
);

module.exports = router;
