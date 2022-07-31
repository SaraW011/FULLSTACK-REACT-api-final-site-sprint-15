import React from "react";
import { Link } from "react-router-dom";

export default function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!email || !password) {
      console.log("could not log in");
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
      <p className="login__title">Welcome back!</p>
      <form onSubmit={handleSubmit} className="login__form">
        <input
          // required
          className="login__input"
          id="email"
          name="email"
          placeholder="Email"
          type="text"
          value={email}
          onChange={handleEmail}
        />
        <input
          // required
          className="login__input"
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePassword}
        />
        <button type="submit" className="login__button">
          Log in
        </button>
      </form>
      <Link to="/signup" className="login__link">
        Not a member yet? Sign up here!
      </Link>
    </div>
  );
}
