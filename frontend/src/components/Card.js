import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Card({ onCardClick, card, onCardLike, onCardDelete }) {
  
  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card)
}

  const currentUser = React.useContext(CurrentUserContext);

  // Checking if the current user is the owner of the current card
  const isOwn = card.owner._id === currentUser._id;

  // Creating a variable which you'll then set in `className` for the delete button
  const cardDeleteButtonClassName = `elements__trash ${
    isOwn ? "elements__trash" : "elements__trash_disabled"   //--> for owner card
  }`;

  
  // Check if the card was liked by the current user
  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  // Create a variable which you then set in `className` for the like button
  const cardLikeButtonClassName = `"elements__heart" ${
    isLiked ? "elements__heart elements__heart_active" : "elements__heart"
  }`;


  return (
    <li className="elements__element">
      <button
        className={cardDeleteButtonClassName}
        type="button"
        aria-label="delete card"
        onClick={handleDeleteClick}
      ></button>

      <img
        className="elements__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />

      <div className="elements__info">
        <h2 className="elements__text">{card.name}</h2>
        <div className="elements__like-container">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="like card"
            onClick={handleLikeClick}
          ></button>

          <div className="elements__number-of-likes">{card.likes.length}</div>
        </div>
      </div>
    </li>
  );
}
