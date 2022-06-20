const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/authorized-err');

const genToken = (payload) => jwt.sign(payload, '111', { expiresIn: '7d' });
// const JWT_SECRET = 'SECRET';

const Authorized = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    throw new AuthError('Необходима авторизация');
  }
  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '111');
  } catch (err) {
    return next(new AuthError('jwt toten не валиден'));
  }
  req.user = payload;
  return next();
};

module.exports = {
  Authorized,
  genToken,
};
