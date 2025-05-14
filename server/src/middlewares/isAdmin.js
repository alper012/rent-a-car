const { AppError } = require('../helpers/');

module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new AppError('Unauthorized', 401);
  }
  next();
};
