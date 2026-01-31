import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import CardList from '../components/CardList';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #003168 0%, #001a38 100%)', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Your HCL Credit portal is active. Browse your exclusive rewards and offers below.
        </Typography>
      </Paper>

      <Box sx={{ px: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
          Exclusive Offers for You
        </Typography>
        <CardList />
      </Box>

      {user?.role === 'SUPER_ADMIN' && (
        <Paper sx={{ mt: 4, p: 3, bgcolor: '#e3f2fd', border: '1px solid #bbdefb' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Super Admin Controls</Typography>
          <Typography variant="body2">As a Super Admin, you have full visibility across all system modules.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
