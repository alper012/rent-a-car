const { User } = require('../models');

const AppError = require('../helpers/AppError');
const { verifyAccessToken } = require('../utilities/token');

module.exports = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      throw new AppError('Unauthorized', 401);
    }
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
