import React from "react";
import Popup from "./Popup";

export default function ImagePopup(props) {
  return (
    <Popup 
    onClose={props.onClose}
    isOpen={props.isOpen} 
    name={props.name}
    >
      <div className="modal__image-wrapper" 
      // onClick={props.onClose}
      >
        <button
          type="button"
          aria-label="close-button"
          className="modal__close-button modal__close-button_type-preview"
          onClick={props.onClose}
        ></button>

        <figure>
          <img
            src={props.imageLink}
            alt={props.imageText}
            className="modal__image-container"
          />
          <figcaption className="modal__image-caption">
            {props.imageText}
          </figcaption>
        </figure>
      </div>
    </Popup>
  );
}
