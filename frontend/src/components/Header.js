import React from "react";
import logo from "../images/logo.svg";
// import mobileMenuIcon from "../images/mobile-menu.svg";
import { Link, useLocation } from "react-router-dom";

function Header({
  props,
  isOpen,
  loggedIn,
  handleLogout,
  email,
  mobileMenu,
  showMobileIcon,
}) {
  const userLocation = useLocation().pathname;

  return (
    <header className="header">
      <Link className="logo" to="/">
        <img id="site-logo" src={logo} alt="Around the USA logo" />
      </Link>

      {loggedIn ? (
        <div
          className="header__menu"
          // className={`header__menu ${isOpen && "header__mobile-menu"}`}
          email={email}
        >
          <h2 className="header__user-email">{email}</h2>
          <Link
            className="header__page-link"
            to="/signin"
            onClick={handleLogout}
          >
            Log out
          </Link>
        </div>
      ) : (
        <>
          {userLocation === "/signin" ? (

            <Link to="/signup" className="header__page-link">
              Sign up
            </Link>
          ) : (
            <Link to="/signin" className="header__page-link">
              Log in
            </Link>
          )}

          </>

      )}

      {/* {loggedIn && showMobileIcon && <img
        id="mobile-menu"
        className="header__mobile-menu"
        src={mobileMenuIcon}
        alt="menu"
        onClick={props.handleMobileMenu}
      />
        } */}
    </header>
  );
}

export default Header;
