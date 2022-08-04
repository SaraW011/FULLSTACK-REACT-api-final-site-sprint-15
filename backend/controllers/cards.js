const Card = require("../models/card");

const BadRequestError = require("../middleware/errors/bad-request-err"); // 400
const UnauthorizedError = require("../middleware/errors/no-authorization-err"); // 401
const NotFoundError = require("../middleware/errors/not-found-err"); // 404

// get existing cards from db:
const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError("try creating a new card");
    })
    .then((cards) => res.send(cards.reverse()))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(201).send(newCard))
    .catch(next);
};

//owner delete card
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new UnauthorizedError("You may only delete your own cards");
    })
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        res.send(card);
      }
    })
    .catch(next);
};

// like card one time:
const likeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // add _id to array if not there
      { new: true }
    );
    if (!like) {
      throw new NotFoundError("could not put like");
    }
    res.status(200).send(like);
  } catch (err) {
    next(err);
  }
};

// Dislike card:
const dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    res.send(dislike);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
