const Joi = require('joi');

const updateProfile = Joi.object({
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const updatePassword = Joi.object({
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

module.exports = {
  updateProfile,
  updatePassword,
};
