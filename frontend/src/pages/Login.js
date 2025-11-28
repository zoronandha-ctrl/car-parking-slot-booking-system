import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await authAPI.login(formData);
      const responseTime = Date.now() - startTime;

      // If response took more than 5 seconds, server was probably waking up
      if (responseTime > 5000) {
        setServerWaking(false);
      }

      onLogin(response.data.user, response.data.token);
      navigate('/slots');
    } catch (err) {
      const responseTime = Date.now() - startTime;
      
      // Check if it's a timeout or slow response (server waking up)
      if (err.code === 'ECONNABORTED' || responseTime > 5000) {
        setServerWaking(true);
        setError('Server is waking up... Please wait (this may take 30-60 seconds)');
        
        // Retry after showing the message
        setTimeout(() => {
          handleSubmit(e);
        }, 3000);
      } else {
        setError(err.response?.data?.message || 'Login failed');
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
        <h2>Login to ParkEasy</h2>
        <p className="auth-subtitle">Welcome back! Please login to your account</p>

        <form onSubmit={handleSubmit}>
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
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
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
            {loading ? (serverWaking ? '⏳ Waking Server...' : '🔐 Logging in...') : '🚀 Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
