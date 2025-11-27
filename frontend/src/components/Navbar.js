import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🅿️ ParkEasy
        </Link>
        
        <ul className="navbar-menu">
          {user ? (
            <>
              <li className="navbar-item">
                <Link to="/slots" className="navbar-link">Find Parking</Link>
              </li>
              <li className="navbar-item">
                <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
              </li>
              {user.role === 'admin' && (
                <li className="navbar-item">
                  <Link to="/admin" className="navbar-link">Admin</Link>
                </li>
              )}
              <li className="navbar-item">
                <span className="navbar-user">👤 {user.name}</span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-button">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
