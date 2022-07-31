const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const validateURL = require("../middleware/validateURL");

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
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
  "/:_id",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.PARAMS]: Joi.object()
      .keys({
        _id: Joi.string().hex(),
      })
      .unknown(true),
  }),
  getUserById
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

module.exports = router;
