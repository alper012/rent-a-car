const Joi = require('joi');

const create = Joi.object({
  body: Joi.object({
    vehicleId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

const getByIdAndRemove = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required(),
  }),
  query: Joi.object({}),
});

const update = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED'),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
  query: Joi.object({}),
});
module.exports = { create, getByIdAndRemove, update };
