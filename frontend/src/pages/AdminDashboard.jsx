import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  People,
  CreditCard
} from '@mui/icons-material';
import withRole from '../hoc/withRole';
import useCards from '../hooks/useCards';
import useCustomers from '../hooks/useCustomers';
import CustomerTable from '../components/CustomerTable';

const AdminDashboard = () => {
    const { cards } = useCards();
    const { customers } = useCustomers('', 1, 5);

    const stats = [
        { label: 'Total Users', value: '2,450', icon: <People />, color: '#4caf50' },
        { label: 'Active Cards', value: cards.length, icon: <CreditCard />, color: '#2196f3' },
        { label: 'Applications', value: '128', icon: <TrendingUp />, color: '#ff9800' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 3 }}>
                Admin Control Center
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={4} key={stat.label}>
                        <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                                {stat.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Recent Applications
                </Typography>
                <CustomerTable customers={customers} role="ADMIN" />
            </Box>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    System Activities
                </Typography>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon><TrendingUp color="success" /></ListItemIcon>
                        <ListItemText
                            primary="Super Admin logged in from Bangalore, IN"
                            secondary="2 minutes ago"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><Warning color="warning" /></ListItemIcon>
                        <ListItemText
                            primary="Database backup partially completed"
                            secondary="1 hour ago"
                        />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default withRole(AdminDashboard, ['ADMIN', 'SUPER_ADMIN']);
