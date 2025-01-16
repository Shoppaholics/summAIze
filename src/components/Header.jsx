import React from "react";
import PropTypes from "prop-types";

function Header({ user }) {
  return (
    <header>
      <div className="header-content">
        <h1>SummAIze</h1>
        {user && <p className="welcome-text">Welcome, {user.email}</p>}
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.object,
};

export default Header;
