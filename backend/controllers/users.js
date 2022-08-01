const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../middleware/errors/bad-request-err"); // 400
const UnauthorizedError = require("../middleware/errors/no-authorization-err"); // 401
const NotFoundError = require("../middleware/errors/not-found-err"); // 404
const User = require("../models/user");

// create new user:
const createUser = async (req, res) => {
  // hashing the password
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hash, // adding the hash to the database
    });
    res.status(201).send({ message: `User ${user} created successfuly` });
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new BadRequestError({
        messege: `${err.statusCode}, Wrong email or password`,
      });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    // return User.findUserByCredentials(email, password)
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
  } catch (err) {
    if (err) {
      throw new UnauthorizedError({
        messege: `${err.statusCode}, authorization failed`,
      });
    }
  }
  next(err);
};

const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret"
    );
    const user = User.findById(payload._id);
    res.status(200).send(user);
  } catch (err) {
    if (err) {
      throw new BadRequestError({
        messege: `${err.statusCode}, wrong user ID`,
      });
    }
  }
  next(err);
};

// get all user from db:
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      throw new NotFoundError("Could not find users");
    } else {
      res.status(200).send(users);
    }
    // default error
  } catch (err) {
    next(err);
  }
};

// find user by ID (current user)
const getUserById = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params._id); // (logged-in user's `_id` property)
    if (!currentUser) {
      throw new NotFoundError("User not found");
    } else if (err.name === "CastError") {
      throw new BadRequestError("Bad request");
    } else {
      res.send(currentUser).status(200);
    }
  } catch (err) {
    next(err);
  }
};

// update user profile:
const updateProfile = async (req, res, next) => {
  try {
    // const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true }
    );
    if (err.name === "ValidationError") {
      throw new BadRequestError({
        messege: `${err.statusCode}, Could not update profile`,
      });
    } else {
      res.status(201).send({ message: `Profile ${user} updated successfuly` });
    }
  } catch (err) {
    next(err);
  }
};

// update user avatar:
const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (err.name === "ValidationError") {
      throw new BadRequestError({
        messege: `${err.statusCode}, Could not update avatar`,
      });
    } else {
      res.status(200).send({ message: `Avatar ${user} updated successfuly` });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateProfile,
  updateAvatar,
  getCurrentUser,
};
