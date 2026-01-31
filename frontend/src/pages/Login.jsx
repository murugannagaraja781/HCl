 import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
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
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #003168 0%, #001a38 100%)'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <BankIcon color="primary" sx={{ fontSize: 60, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              HCL Bank
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure Credit Portal Access
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email / Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, py: 1.5, fontWeight: 700, borderRadius: 2 }}
            >
              Sign In
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Don't have an account? <Button variant="text" size="small" onClick={() => navigate('/')}>Return Home</Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;