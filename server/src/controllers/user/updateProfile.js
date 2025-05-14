const { Response, AppError } = require('../../helpers');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const oldUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (oldUser) {
      throw new AppError('Email already exists', 400);
    }
    await user.update(req.body);
    user.password = undefined;
    return Response.success(res, user);
  } catch (error) {
    next(error);
  }
};
