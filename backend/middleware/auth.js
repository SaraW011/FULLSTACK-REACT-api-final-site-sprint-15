/* verify token from headers
If all OK middleware should add token payload to user object
and call next() */
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("./errors/no-authorization-err"); // 401
const AccessDeniedError = require("./errors/no-access-err"); // 403

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Unfortunately your request could not be authorized..."
    );
  }
  // if matched, add the user object as the payload and pass in the secret.
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret"
    );
    if (!payload) {
      throw new AccessDeniedError("Access denied");
    }
    req.user = payload; // adding the payload to the Request object
    next(); // passing the request further along
  } catch (err) {
    next(err);
  }
};
module.exports = auth;
