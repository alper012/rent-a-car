const { AppError, Response } = require('../../helpers');
const { User } = require('../../models');
const { comparePassword } = require('../../utilities/password');
const { generateAccessToken } = require('../../utilities/token');

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'isAdmin',
      ],
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const isPasswordCorrect = comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid password', 401);
    }
    user.password = undefined;
    Response.success(res, {
      accessToken: generateAccessToken({ id: user.id }),
      user,
    });
  } catch (error) {
    next(error);
  }
};
