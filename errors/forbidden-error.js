const { ERROR_403 } = require('../utils/code');

class ForbiddenError extends Error {
  constructor(message = 'Доступ запрещен') {
    super(message);
    this.statusCode = ERROR_403;
  }
}

module.exports = ForbiddenError;
