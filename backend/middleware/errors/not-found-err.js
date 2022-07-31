// Custom 404 Error Constructor:

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

/* Three Important Rules for Centralized Error Handling:
 1. Always terminate promise chains with a catch() block, using "next"
 2. Don't use throw in last catch() blocks, it will have nowhere to go
    b/c throw redirects code handling to the next catch() block.
 3. If the handler receives an error without a status, return a server error. */
