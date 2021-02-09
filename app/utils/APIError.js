const httpStatus = require('http-status');

/**
 * Class representing an API error.
 */
class APIError extends Error {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   */
  constructor({
    message,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    stack,
    errors,
  }) {
    super({
      message, errors, status, stack,
    });

    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.stack = stack || this.stack;
  }
}

module.exports = APIError;