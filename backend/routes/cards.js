const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const validateURL = require("../middleware/validateURL");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// returns all cards
router.get(
  "/",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    //unknown(true)->allow fields that are not listed in the validation object
  }),
  getCards
);

// creates a new card
router.post(
  "/",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL),
      user: Joi.object()
        .keys({
          _id: Joi.string().hex().required(),
          //Requires the string value to be a valid hexadecimal string.
        })
        .unknown(true),
    }),
  }),
  createCard
);

// deletes a card by _id
router.delete(
  "/:cardId",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.PARAMS]: Joi.object()
      .keys({
        cardId: Joi.string().hex().required(),
      })
      .unknown(true),
  }),
  deleteCard
); // need same value as in controller

// like a card
router.put(
  "/:cardId/likes",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.PARAMS]: Joi.object()
      .keys({
        cardId: Joi.string().hex().required(),
      })
      .unknown(true),
  }),
  likeCard
);

// unlike a card
router.delete(
  "/:cardId/likes",
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.PARAMS]: Joi.object()
      .keys({
        cardId: Joi.string().hex().required(),
      })
      .unknown(true),
  }),
  dislikeCard
);

module.exports = router;
