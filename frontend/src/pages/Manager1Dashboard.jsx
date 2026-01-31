import React, { useState, Fragment } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import useCustomers from '../hooks/useCustomers';
import useDebounce from '../hooks/useDebounce';
import withRole from '../hoc/withRole';
import CustomerTable from '../components/CustomerTable';

const Manager1Dashboard = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const debouncedSearch = useDebounce(search, 500);
    const { customers, totalPages, updateCustomer } = useCustomers(debouncedSearch, page, 5);

    const handleAction = (id, type, data) => {
        if (type === 'evaluate') {
            updateCustomer(id, { limitStatus: 'Limit Set' }, { action: 'Score Evaluated', actor: 'Manager1' });
        } else if (type === 'view') {
            setSelectedHistory(data || []);
            setHistoryOpen(true);
        } else if (type === 'reject') {
            updateCustomer(id, { limitStatus: 'Rejected', finalStatus: 'Rejected' }, { action: 'Application Rejected', actor: 'Manager1' });
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                        Credit Evaluation
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Review applicant credit scores and evaluate eligibility.
                    </Typography>
                </Box>

                <TextField
                    placeholder="Search customers..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 350 }, backgroundColor: 'white' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <strong>Hackathon Rule:</strong> Applications with Credit Score <strong>&gt; 800</strong> are eligible for <strong>Fast Track Approval</strong>. Scores below 600 should be carefully reviewed for rejection.
            </Alert>

            <CustomerTable
                customers={customers}
                role="MANAGER1"
                onAction={handleAction}
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, v) => setPage(v)}
                    color="primary"
                    shape="rounded"
                    sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }}
                />
            </Box>

            <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Application History</DialogTitle>
                <DialogContent dividers>
                    <List dense>
                        {selectedHistory.map((item, i) => (
                            <Fragment key={i}>
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
                            </Fragment>
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

export default withRole(Manager1Dashboard, ['MANAGER1', 'ADMIN', 'SUPER_ADMIN']);
