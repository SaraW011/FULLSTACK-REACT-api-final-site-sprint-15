const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../middleware/errors/bad-request-err"); // 400
const UnauthorizedError = require("../middleware/errors/no-authorization-err"); // 401
const NotFoundError = require("../middleware/errors/not-found-err"); // 404
const ConflictError = require("../middleware/errors/conflict-err"); // 409

const User = require("../models/user");

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

// create new user:
const createUser = async (req, res, next) => {
  const { email, password } = req.body;
  // hashing the password with salt (default 10)
  bcrypt.hash(password, 10)
    // is email in database?
    .then(() => User.create({
      email,
      password
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError("Wrong email or password");
      }
      console.log(user);
      res.status(201).send({
        message: `User ${user} created successfuly`,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError("User email is already registered");
      }
      next(err);
    })
    .catch(next);
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    // authentication successful! user is in the user variable
    if (user) {
      // sign token with private key:
      const token = jwt.sign(
        {
          _id: user._id,
        },
        // generate secret key in console and store in .env file:
        // node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
        NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
        {
          expiresIn: "7d",
        }
      );
      res.status(200).send({
        token,
      });
    } else {
      console.log("is it failed");
      throw new UnauthorizedError({
        messege: "Authorization failed",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new BadRequestError({
        messege: "user ID incorrect",
      });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    console.log(err);

    next(err);
  }
};

// find user by ID (current user)
const getUserById = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.userId).orFail(() => {
      throw new NotFoundError(`${currentUser} not found`);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

// update user avatar:
const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      // eslint-disable-next-line comma-dangle
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getUserById,
};
