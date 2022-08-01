const Card = require("../models/card");

const BadRequestError = require("../middleware/errors/bad-request-err"); // 400
const UnauthorizedError = require("../middleware/errors/no-authorization-err"); // 401
const NotFoundError = require("../middleware/errors/not-found-err"); // 404

// get existing cards from db:
const getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    if (!card) {
      throw new NotFoundError({
        message: `${err.statusCode}, no cards available`,
      });
    } else {
      res.status(200).send(JSON.parse(cardsData));
    }
  } catch (err) {
    next(err);
  }
};

// Create a new card:
const createCard = async (req, res, next) => {
  try {
    const { name, link, owner = req.user._id } = req.body;
    const card = await Card.create({ name, link, owner });
    if (!card) {
      throw new BadRequestError({
        message: `${err.statusCode}, Bad request`,
      });
    } else {
      res.status(201).send(card);
    }
  } catch (err) {
    next(err);
  }
};

//owner delete card
const deleteCard = async (req, res, next) => {
  const card = Card.findById(req.params.cardId); // need same value as in cardsRouter
  if (!card) {
    throw new NotFoundError("Could not find Card");
  } else if (req.user._id !== card.owner.toString()) {
    throw new UnauthorizedError("You may only delete your own cards");
  } else {
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
  }
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

//end
