const { ERROR_409 } = require('../utils/code');

class ConflictError extends Error {
  constructor(message = 'email уже существует') {
    super(message);
    this.statusCode = ERROR_409;
  }
}

module.exports = ConflictError;
