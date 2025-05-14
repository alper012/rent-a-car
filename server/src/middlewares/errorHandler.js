const { AppError, Response } = require('../helpers');

module.exports = (err, req, res, next) => {
  console.error(err);
  if (err instanceof AppError) {
    return Response.custom(res, err.status, err.message);
  }
  if (err instanceof SyntaxError) {
    return Response.badRequest(res, 'Invalid JSON');
  }
  return Response.serverError(res, 'Internal Server Error');
};
