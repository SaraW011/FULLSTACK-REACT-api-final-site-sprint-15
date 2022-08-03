import React from 'react';
import PopupWithForm from "./PopupWithForm";


export default function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

    // clear the input:
    React.useEffect(() => {
      avatarRef.current.value = '';
    }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(avatarRef.current.value, "frontend")
    props.onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      title="Change profile picture"
      buttonText="Save"
    >
      <input
        ref={avatarRef}
        id="input_type_avatar-url"
        type="url"
        className="form__input form__input_type_link"
        placeholder="avatar link"
        name="link"
        required
      />
      <span id="input_type_avatar-url-error" className="form__error_visible"></span>
    </PopupWithForm>
  );
}
