const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../middleware/errors/bad-request-err"); // 400
const UnauthorizedError = require("../middleware/errors/no-authorization-err"); // 401
const NotFoundError = require("../middleware/errors/not-found-err"); // 404
const User = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;

// create new user:
const createUser = (req, res) => {
  // hashing the password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash, // adding the hash to the database
      })
    )
    .then((user) => {
      res.status(201).send({ message: `User ${user} created successfuly` });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError({
          messege: `${err.statusCode}, Wrong email or password`,
        });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  // const { email, password } = req.body;
  User.findOne({ email: req.body.email.toLowerCase() })
    // return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      if (user) {
        // sign token with private key:
        const token = jwt.sign(
          { _id: user._id },
          //generate secret key in console and store in .env file:
          //node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
          NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
          { expiresIn: "7d" }
        );
        res.status(200).send({ token });
      }
    })
    .catch((err) => {
      if (err) {
        throw new UnauthorizedError({
          messege: `${err.statusCode}, authorization failed`,
        });
      }
    })
    .catch(next);
};

// get all user from db:
const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError("Could not find users");
    })
    .then((users) => res.status(200).send(users))
    // default error
    .catch(next);
};

// find user by ID (current user)
const getUserById = (req, res, next) => {
  User.findById(req.params._id) // (logged-in user's `_id` property)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((currentUser) => {
      res.send(currentUser).status(200);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Bad request");
      }
    })
    .catch(next);
};

// update user profile:
function updateProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(201).send({ message: `Profile ${user} updated successfuly` });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError({
          messege: `${err.statusCode}, Could not update profile`,
        });
      }
    })
    .catch(next);
}

// update user avatar:
const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send({ message: `Avatar ${user} updated successfuly` });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError({
          messege: `${err.statusCode}, Could not update avatar`,
        });
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
