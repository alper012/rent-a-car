const { AppError, Response } = require('../../helpers');
const { User } = require('../../models');
const { hashPassword } = require('../../utilities/password');

module.exports = async (req, res, next) => {
  try {
    const oldUser = await User.findOne({ where: { email: req.body.email } });
    if (oldUser) {
      throw new AppError('User already exists', 400);
    }
    const user = User.build({
      ...req.body,
      password: hashPassword(req.body.password),
    });
    await user.save();
    user.password = undefined;
    return Response.success(res, user);
  } catch (error) {
    next(error);
  }
};
