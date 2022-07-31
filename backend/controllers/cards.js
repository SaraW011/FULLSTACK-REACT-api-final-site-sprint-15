const Card = require("../models/card");

const BadRequestError = require("../middleware/errors/bad-request-err"); // 400
const UnauthorizedError = require("../middleware/errors/no-authorization-err"); // 401
const NotFoundError = require("../middleware/errors/not-found-err"); // 404

// get existing cards from db:
const getCards = (req, res, next) => {
  Card.find({})
    .then((cardsData) => {
      if (!cardsData) {
        throw new NotFoundError({
          message: `${err.statusCode}, Could not get cards`,
        });
      }
      res.status(200).send(JSON.parse(cardsData));
    })
    .catch(next);
};

// Create a new card:
const createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError({
          message: `${err.statusCode}, Bad request`,
        });
      }
      res.status(201).send(card);
    })
    .catch(next);
};

//owner delete card
const deleteCard = async (req, res, next) => {
  const { cardId } = req.params.cardId; // need same value as in cardsRouter
  Card.findById(cardId).then((card) => {
    if (!card) {
      throw new NotFoundError("Could not find Card");
    } else if (req.user._id !== card.owner.toString()) {
      throw new UnauthorizedError("You may only delete your own cards");
    }
  });
  Card.findByIdAndRemove(card._id.toString()) //Mongoose
    .then(() => {
      res.status(200);
      res.json({ message: "your card is now deleted" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError({
          message: `${err.statusCode}, Bad request`,
        });
      }
      next(err);
    });
};

// like card one time:
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(
      new NotFoundError({
        message: `${err.statusCode}, could not put like`,
      })
    )
    .then((card) => {
      res.status(200).send(card.likes);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError({
          message: `${err.statusCode}, could not find card data`,
        });
      }
    })
    .catch(next);
};

// Dislike card:
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError({
        message: `${err.statusCode}, Could Not delete card like`,
      });
    })
    .then((card) => res.status(200).send(card.likes))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError({
          message: `${err.statusCode}, incorrect data`,
        });
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
