const { User } = require('../../models');
const { AppError, Response } = require('../../helpers');
const { hashPassword, comparePassword } = require('../../utilities/password');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { oldPassword, newPassword } = req.body;

    const isMatch = comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new AppError('Old password is incorrect', 400);
    }

    const hashedPassword = hashPassword(newPassword);
    await user.update({ password: hashedPassword });
    user.password = undefined;
    return Response.success(res, user);
  } catch (error) {
    next(error);
  }
};
