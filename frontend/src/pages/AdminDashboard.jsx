import {
  TrendingUp,
  Warning,
  People,
  CreditCard,
  Search as SearchIcon
} from '@mui/icons-material';
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
  Avatar,
  TextField,
  InputAdornment,
  Pagination
} from '@mui/material';
import { useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import withRole from '../hoc/withRole';
import useCards from '../hooks/useCards';
import useCustomers from '../hooks/useCustomers';
import CustomerTable from '../components/CustomerTable';

const AdminDashboard = () => {
    const { cards } = useCards();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const debouncedSearch = useDebounce(search, 500);
    const { customers, totalPages, updateCustomer } = useCustomers(debouncedSearch, page, 5);

    const handleAction = (id, type, data) => {
        if (type === 'view') {
            setSelectedHistory(data || []);
            setHistoryOpen(true);
        } else if (type === 'reject') {
            updateCustomer(id, { finalStatus: 'Rejected', limitStatus: 'Rejected' }, { action: 'Application Rejected', actor: 'Admin' });
        }
    };

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Recent Applications
                    </Typography>
                    <TextField
                        placeholder="Search applications..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 300 }, backgroundColor: 'white' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <CustomerTable
                    customers={customers}
                    role="ADMIN"
                    onAction={handleAction}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    System Activities
                </Typography>
                <Divider />
                <List dense>
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

            <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Application History</DialogTitle>
                <DialogContent dividers>
                    <List dense>
                        {selectedHistory.map((item, i) => (
                            <React.Fragment key={i}>
                                <ListItem sx={{ py: 1.5 }}>
                                    <ListItemText
                                        primary={<strong>{item.action}</strong>}
                                        secondary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                <Typography variant="caption">{item.actor}</Typography>
                                                <Typography variant="caption">{item.date}</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {i < selectedHistory.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHistoryOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default withRole(AdminDashboard, ['ADMIN', 'SUPER_ADMIN']);
