import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);
  const [wakingTime, setWakingTime] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    let interval;
    if (serverWaking) {
      setWakingTime(0);
      interval = setInterval(() => {
        setWakingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [serverWaking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setServerWaking(false);

    const startTime = Date.now();

    try {
      const response = await authAPI.register(formData);
      const responseTime = Date.now() - startTime;

      if (responseTime > 5000) {
        setServerWaking(false);
      }

      onLogin(response.data.user, response.data.token);
      navigate('/slots');
    } catch (err) {
      const responseTime = Date.now() - startTime;
      
      if (err.code === 'ECONNABORTED' || responseTime > 5000) {
        setServerWaking(true);
        setError('Server is waking up... Please wait (this may take 30-60 seconds)');
        
        setTimeout(() => {
          handleSubmit(e);
        }, 3000);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
        setServerWaking(false);
      }
    } finally {
      if (!serverWaking) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join ParkEasy today and start parking smarter</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className={serverWaking ? "server-waking-message" : "error-message"}>
              {error}
            </div>
          )}

          {serverWaking && (
            <div className="server-waking-animation">
              <div className="waking-spinner"></div>
              <p className="waking-text">
                🌟 Waking up the server... {wakingTime}s
              </p>
              <p className="waking-subtext">
                Free tier servers sleep after inactivity. First request may take 30-60 seconds.
              </p>
              <div className="waking-progress">
                <div className="waking-progress-bar" style={{ width: `${Math.min(wakingTime * 2, 100)}%` }}></div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (serverWaking ? '⏳ Waking Server...' : '✨ Creating account...') : '🚀 Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
