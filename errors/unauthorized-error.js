const { ERROR_401 } = require('../utils/code');

class UnauthorizedError extends Error {
  constructor(message = 'Требуется авторизация') {
    super(message);
    this.statusCode = ERROR_401;
  }
}

module.exports = UnauthorizedError;
