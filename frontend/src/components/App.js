import React from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
//Use Routes instead of Switch in react-router v6
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import auth from "../utils/auth";
import api from "../utils/Api";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function App() {
  // state variables responsible for the visibility of popups:
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isPreviewImageOpen, setIsPreviewImageOpen] = React.useState(false);
  const [isDeleteImagePopupOpen, setIsDeleteImagePopupOpen] =
    React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [userData, setUserData] = React.useState({});
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  // const [mobileMenu, setMobileMenu] = React.useState(false);

  const navigate = useNavigate();

  //**----------->> AUTH <<--------*/

  // register
  function handleRegistration(email, password) {
    auth
      .signup(email, password)
      .then((res) => {
        if (res) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      })
      .then(() => {
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
      });
  }

  // check jwt token validation
  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            const data = {
              email: res.data.email,
              id: res.data._id,
            };
            setUserData(data);
            setLoggedIn(true);
            navigate.push("/");
          }
        })
        .catch((err) => console.error(err.status, err.statusText));
    }
  }, []);

  // login
  function handleLogin(email, password) {
    auth
      .signin(email, password)
      .then((data) => {
        //keep user logged in, ref to token Bearer
        if (data.token) {
          localStorage.setItem("jwt", data.token);
        //set email on reroute to main:
          const userData = {
            email: email,
          };
          setUserData(userData); 
          setLoggedIn(true);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      });
  }

  React.useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  // logout
  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    navigate.push("/signin");
  }

  // function handleMobileMenu() {
  //   if (!mobileMenu) {
  //     setMobileMenu(true);
  //   } else {
  //     setMobileMenu(false);
  //   }
  // }

  //**----------->> API <<-------------------*/
  React.useEffect(() => {
    api
      .getData()
      .then((data) => {
        if (data) {
          setCurrentUser(data);
        }
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      });
  }, []);

  React.useEffect(() => {
    (async function () {
      try {
        const cardsData = await api.getInitialCards();
        if (cardsData) {
          setCards(cardsData);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  function handleUpdateUser(input) {
    api
      .editUserInfo(input.name, input.about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      });
  }

  function handleUpdateAvatar(input) {
    api
      .editAvatar(input.avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      });
  }

  function toggleLike(card) {
    setCards((state) =>
      state.map((currentCard) =>
        currentCard._id === card._id ? card : currentCard
      )
    );
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some(
      (user) => user._id.toString() === currentUser._id
    );
    if (!isLiked) {
      api
        .likeCard(card._id.toString())
        .then((card) => {
          toggleLike(card);
        })
        //catch err at the very end of any server request:
        .catch((err) => {
          console.log(err.status, err.statusText);
        });
    } else {
      api
        .dislikeCard(card._id.toString())
        .then((card) => {
          toggleLike(card);
        })
        .catch((err) => {
          console.log(err.status, err.statusText);
        });
    }
  }

  function handleCardDelete(evt) {
    evt.preventDefault();
    api
      .deleteCard(selectedCard._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== selectedCard._id)
        );
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      });
  }

  function handleAddPlaceSubmit(cardData) {
    api
      .addPlaceCard(cardData.name, cardData.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status, err.statusText);
      });
  }

  // **----------->> HANDLE POPUPS <<-------------------*/

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsPreviewImageOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleDeletePlaceClick(card) {
    setIsDeleteImagePopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsPreviewImageOpen(false);
    setIsDeleteImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});

    // setMobileMenu(false);
  }

  //**----------->> RENDER <<-------------------*/
  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="main">
          <Header
            // showMobileIcon={handleMobileMenu}
            // isOpen={setMobileMenu}
            loggedIn={loggedIn}
            email={userData.email}
            handleLogout={handleLogout}
          />

          <Routes>
            <Route
              path="/signup"
              element={<Register onSubmit={handleRegistration} />}
            ></Route>

            <Route
              path="/signin"
              element={<Login onSubmit={handleLogin} />}
            ></Route>

            <Route
              exact
              path="/"
              loggedIn={loggedIn}
              element={
                <ProtectedRoute 
                loggedIn={loggedIn} 
                email={userData.email}
                >
                  <Main
                    loggedIn={loggedIn} 
                    onEditProfileClick={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onEditAvatarClick={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeletePlaceClick}
                  />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="signup" />} />
          </Routes>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
          />
          <ConfirmDeletePopup
            isOpen={isDeleteImagePopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleCardDelete}
          />
          <ImagePopup
            name="preview-image"
            onClose={closeAllPopups}
            isOpen={isPreviewImageOpen}
            imageLink={selectedCard.link}
            imageText={selectedCard.name}
          />
          <InfoTooltip
            name="tooltip"
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isRegistered={isRegistered}
          />

          <Footer />
        </div>
      </CurrentUserContext.Provider>
    </div>
  );
}
