import React from "react";
import Popup from "./Popup";

// to easily handle forms make custom hook 
// (credit Gennadiy Barsegyan reviewer):

// export function useForm(inputValues) {

//   const [values, setValues] = React.useState(inputValues);

//   const handleChange = (event) => {
//     const {value, name} = event.target;
//     setValues({...values, [name]: value});
//   };
//   return {values, handleChange, setValues};
// } 

export default function PopupWithForm(props) {
  return (
    <Popup
      onClose={props.onClose}
      isOpen={props.isOpen}
      name={props.name}
    >
      <div className="modal__container">
        <button
          type="button"
          aria-label="close-button"
          className="modal__close-button"
          onClick={props.onClose}
        ></button>

        <h3 className="modal__title">{props.title}</h3>

        <form
          action="#"
          className={`form form-${props.name}`}
          name={`form-${props.name}`}
          onSubmit={props.onSubmit}
          // noValidate
        >
          {props.children}

          <button
            type="submit"
            className={`form__button form__button_type-${props.name}`}
            aria-label="delete-button"
          >
            {" "}
            {props.buttonText}
          </button>
        </form>
      </div>
    </Popup>
  );
}
