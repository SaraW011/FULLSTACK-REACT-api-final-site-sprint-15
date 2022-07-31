import React from "react";
import { Link } from "react-router-dom";

export default function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!email || !password) {
      console.log("could not register");
      return;
    }
    props.onSubmit(email, password);
  };

  const handleEmail = (evt) => {
    setEmail(evt.target.value);
  };

  const handlePassword = (evt) => {
    setPassword(evt.target.value);
  };

  return (
    <div className="login">
      <h1 className="login__title">Sign Up</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        <input
          className="login__input"
          name="email"
          placeholder="Email"
          // required
          type="email"
          value={email}
          onChange={handleEmail}
        ></input>
        <input
          className="login__input"
          name="password"
          placeholder="Password"
          // required
          type="password"
          value={password}
          onChange={handlePassword}
        ></input>
        <button className="login__button" type="submit">
          Sign Up
        </button>
      </form>
      <Link to="/signin" className="login__link">
        Already a member? Log in here!
      </Link>
    </div>
  );
}
