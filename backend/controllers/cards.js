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
    .then((newCard) => res.send(newCard))
    .catch(next);
};

//owner delete card
const deleteCard = async (req, res, next) => {
  const card = Card.findById(req.params.cardId); // need same value as in cardsRouter
  if (!card) {
    throw new NotFoundError("Could not find Card");
  } else if (req.user._id !== card.owner.toString()) {
    throw new UnauthorizedError("You may only delete your own cards");
  } else {
    await Card.findByIdAndRemove(card._id.toString()) //Mongoose
      .then(() => {
        res.json({ message: "your card is now deleted" });
      })
      .catch((err) => {
        if (err.name === "CastError") {
          throw new BadRequestError("Bad request");
        }
        next(err);
      });
  }
};

// const deleteCard = async (req, res, next) => {
//   try {
//     const card = await Card.findByIdAndDelete(req.params.cardId);
//     if (!card) {
//       throw new NotFoundErr("Cannot find card to delete"); // Status(404)
//     }
//     res.status(200).json(`Card ${card.name} deleted successfully`);
//   } catch (err) {
//     next(err);
//   }
// };

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
      { $pull: { likes: req.user._id.toString() } },
      { new: true }
    );
    res.status(200).send(dislike);
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
