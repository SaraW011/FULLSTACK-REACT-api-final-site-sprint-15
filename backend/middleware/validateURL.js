// validator.isUrl is stricter than the built-in Joi URI validator.
// string.uri is the default validator and the error code it raises

const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    // value returns the same kind of validation error
    // that the default URI validator does
    return value;
  }
  return helpers.error("string.uri");
};

module.exports = validateURL;
