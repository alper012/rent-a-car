const Joi = require('joi');

const create = Joi.object({
  body: Joi.object({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().required(),
    priceADay: Joi.number().required(),
    seats: Joi.number().required(),
    power: Joi.number().required(),
    fuelType: Joi.string().required(),
    transmission: Joi.string().required(),
    image: Joi.string().required(),
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
    brand: Joi.string(),
    model: Joi.string(),
    year: Joi.number(),
    priceADay: Joi.number(),
    seats: Joi.number(),
    power: Joi.number(),
    fuelType: Joi.string(),
    transmission: Joi.string(),
    image: Joi.string(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
  query: Joi.object({}),
});

module.exports = { create, update, getByIdAndRemove };
