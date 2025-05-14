const { Response } = require('../../helpers');

module.exports = async (req, res, next) => {
  try {
    const user = req.user;
    return Response.success(res, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    next(error);
  }
};
