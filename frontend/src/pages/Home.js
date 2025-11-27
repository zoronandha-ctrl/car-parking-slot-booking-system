import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ParkEasy</h1>
          <p className="hero-subtitle">Your Smart Parking Solution</p>
          <p className="hero-description">
            Find and book parking slots instantly. Save time, avoid hassle, and park with confidence.
          </p>
          <div className="hero-buttons">
            <Link to="/slots" className="btn btn-primary">Find Parking</Link>
            <Link to="/register" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose ParkEasy?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find available parking slots in seconds with our intuitive search</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Booking</h3>
            <p>Book your spot online and pay securely through our platform</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Confirmation</h3>
            <p>Get immediate booking confirmation with all details</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Track Bookings</h3>
            <p>Manage all your bookings from one convenient dashboard</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Park Smarter?</h2>
        <p>Join thousands of drivers who trust ParkEasy for hassle-free parking</p>
        <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
      </div>
    </div>
  );
}

export default Home;
