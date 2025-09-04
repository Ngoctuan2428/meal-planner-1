import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import '../styles/Login.scss';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra dữ liệu đầu vào phía client
    if (!identifier.trim()) {
      setError('Please enter your username or email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ identifier, password });

      if (res.data?.token && res.data?.user) {
        // Lưu thông tin người dùng và token vào localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('userId', res.data.user.id);

        navigate('/');
      } else {
        setError(res.data?.error || res.data?.message || 'Invalid username/email or password');
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          setError('Incorrect password');
        } else if (status === 404) {
          setError('User not found');
        } else {
          setError(err.response.data?.message || 'Login failed');
        }
      } else if (err.request) {
        setError('Unable to connect to the server');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo">🥕</div>
          <h2>Log In</h2>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <label>Email or Username</label>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label className="password-label">
            Password
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password
            </Link>
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-icon"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : (
              <>
                <LogIn size={18} /> Log In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
