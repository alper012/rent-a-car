const express = require('express');
const router = express.Router();

const { validateSchema, verify } = require('../middlewares');
const userController = require('../controllers/user');
const userSchema = require('../schemas/user.schema');

router.patch(
  '/profile',
  verify,
  validateSchema(userSchema.updateProfile),
  userController.updateProfile
);

router.patch(
  '/password',
  verify,
  validateSchema(userSchema.updatePassword),
  userController.updatePassword
);

module.exports = router;
