import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function EditProfilePopup(props) {
  // Subscription to the context
  const currentUser = React.useContext(CurrentUserContext);

  const [profileName, setName] = React.useState("");
  const [profileDescription, setDescription] = React.useState("");

  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();

    // Pass the values of the managed components to the external handler
    props.onUpdateUser({
      name: profileName,
      about: profileDescription,
    });
  }

  function handleUserNameUpdate(e) {
    setName(e.target.value);
  }

  function handleUserDescriptionUpdate(e) {
    setDescription(e.target.value);
  }

  // After loading the current user from the API
  // their data will be used in managed components.
  React.useEffect(() => {
    setName(currentUser.name || "");
    setDescription(currentUser.about || "");
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      name="edit-profile"
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      title="Edit profile"
      buttonText="Save"
    >
      <input
        id="input_type_name"
        type="text"
        value={profileName}
        onChange={handleUserNameUpdate}
        className="form__input form__input_type_name"
        placeholder="name"
        name="name"
        minLength="2"
        maxLength="40"
        required
      />
      <span id="input_type_name-error" className="form__error"></span>
      <input
        id="input_type_job"
        type="text"
        value={profileDescription}
        onChange={handleUserDescriptionUpdate}
        className="form__input form__input_type_job"
        placeholder="profession"
        name="job"
        minLength="2"
        maxLength="200"
        required
      />
      <span id="input_type_job-error" className="form__error"></span>
    </PopupWithForm>
  );
}
