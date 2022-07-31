import React from "react";

export default function Popup({
  name,
  isOpen,
  onClose,
  children,
  // handleOverlay,
}) {
  // `useEffect` for the `Escape` listener:
  React.useEffect(() => {
    // prevent adding the listener if the popup is not opened
    if (!isOpen) return;
    // define the handler inside `useEffect`,
    // so that it wouldn’t lose the reference to be able to remove it
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeByEscape);
    // unmount:
    return () => document.removeEventListener("keydown", closeByEscape);
    // dependencies array add the listener only when it’s opened:
  }, [isOpen, onClose]);

  // // improve for use -> make wrapper block
  // React.useEffect(() => {
  //   if (!isOpen) return;
  //   function handleOverlay(e) {
  //     e.stopPropagation();
  //     if (e.target === e.currentTarget) {
  //       onClose();
  //     }
  //   }

  //   document.addEventListener("click", handleOverlay);
  //   return () => document.removeEventListener("click", handleOverlay);
  // }, []);

  // add main wrapper with class `modal` and `modal_open`
  return (
    <div
      className={`modal ${isOpen ? "modal_open" : ""} modal_type_${name}`}
      // onClick={handleOverlay}
    >
      {children}
    </div>
  );
}
