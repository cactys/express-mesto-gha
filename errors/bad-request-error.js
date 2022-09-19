const { ERROR_400 } = require('../utils/code');

class BadRequestError extends Error {
  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.statusCode = ERROR_400;
  }
}

module.exports = BadRequestError;
