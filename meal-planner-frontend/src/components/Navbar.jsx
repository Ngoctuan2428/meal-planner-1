import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">🥕</span>
          <div className="logo-text">
            <div>Eat</div>
            <div>This</div>
            <div>Much</div>
          </div>
        </NavLink>

        {/* Menu */}
        <div className="navbar-menu">
          <NavLink to="/" end>Supported Diets</NavLink>
          <NavLink to="/workout-plan">Workout Plan</NavLink>
          <NavLink to="/history">History</NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {username ? (
            <>
              <span className="navbar-username">👤 {username}</span>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register" className="signup-button">Sign Up</NavLink>
              <NavLink to="/login" className="signin-link">Already a member? Sign in</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
