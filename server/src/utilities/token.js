const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: '10h',
  });
  return token;
};

const verifyAccessToken = (token) => {
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateAccessToken, verifyAccessToken };
