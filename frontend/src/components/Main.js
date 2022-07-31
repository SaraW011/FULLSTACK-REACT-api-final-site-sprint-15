import React from "react";
import Card from "./Card";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__avatar-wrapper">
          <img
            className="profile__avatar"
            src={currentUser.avatar}
            alt="My Avatar"
          />

          <button
            onClick={onEditAvatarClick}
            type="button"
            aria-label="edit-avatar-button"
            className="profile__avatar-edit-button"
          ></button>
        </div>

        <div className="profile__info">
          <div>
            <h1 className="profile__name">{currentUser.name}</h1>

            <button
              onClick={onEditProfileClick}
              aria-label="edit-button"
              type="button"
              className="profile__edit-button"
              name="edit"
            ></button>
          </div>

          <h2 className="profile__title">{currentUser.about}</h2>
        </div>

        <button
          onClick={onAddPlaceClick}
          type="button"
          aria-label="add-button"
          className="profile__add-button"
        ></button>
      </section>

      <section className="elements">
        <ul className="elements__list">
          {cards.map((element) => (
            <Card
              card={element}
              key={element._id}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
