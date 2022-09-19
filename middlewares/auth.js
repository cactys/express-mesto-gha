const jwt = require('jsonwebtoken');
const { ERROR_401 } = require('../utils/code');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(ERROR_401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
