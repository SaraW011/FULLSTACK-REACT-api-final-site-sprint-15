const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    default: "Explorer",
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: "Please enter a valid link",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, //Stops API from returning the password hash
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email: req.body.username.toLowerCase() })
    .select("+password") //get password hash
    .then((user) => {
      if (!user || user.password !== req.body.password) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        // this "then" is added to bcrypt method (scope)
        if (!matched) {
          // the hashes didn't match, rejecting the promise

          return Promise.reject(new Error("Incorrect email or password"));
        }
        // authentication successful:

        return user; // now user is available
      });
    });
};

module.exports = mongoose.model("user", userSchema);
