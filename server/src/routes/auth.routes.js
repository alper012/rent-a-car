const express = require('express');
const router = express.Router();

const { validateSchema, verify } = require('../middlewares');
const authController = require('../controllers/auth');
const authSchema = require('../schemas/auth.schema');

router.get('/me', verify, authController.currentUser);

router.post('/login', validateSchema(authSchema.login), authController.login);

router.post(
  '/register',
  validateSchema(authSchema.register),
  authController.register
);

module.exports = router;
