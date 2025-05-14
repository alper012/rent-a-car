const { AppError } = require('../helpers/');

module.exports = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (error) {
      console.log(error);
      throw new AppError('Validation Error', 400);
    }
    return next();
  } catch (error) {
    next(error);
  }
};
