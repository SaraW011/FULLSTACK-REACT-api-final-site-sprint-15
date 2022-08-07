const express = require("express");

const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const validateURL = require("../middleware/validateURL");

const {
  getUsers,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getUserById,
} = require("../controllers/users");

// returns all users
router.get(
  "/",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
  }),
  getUsers
);

// returns a user by _id
router.get(
  "/me",
  celebrate({
    headers: Joi.object().keys({}).unknown(true),
  }),
  getCurrentUser
);

// update profile
router.patch(
  "/me",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  updateProfile
);

// update avatar
router.patch(
  "/me/avatar",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  updateAvatar
);

router.get(
  "/:userId",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.PARAMS]: Joi.object()
      .keys({
        userId: Joi.string().hex(),
      })
      .unknown(true),
  }),
  getUserById
);

module.exports = router;
