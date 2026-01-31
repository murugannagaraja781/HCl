import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      // Decode user role from local storage or get from result
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const role = storedUser?.role;

      if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'MANAGER1') {
        navigate('/manager1');
      } else if (role === 'MANAGER2') {
        navigate('/manager2');
      } else if (role === 'MANAGER') {
        navigate('/manager');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Credit Card Portal</h1>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin@gmail.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" className="login-btn">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
