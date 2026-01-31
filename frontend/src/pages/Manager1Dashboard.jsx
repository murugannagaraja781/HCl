import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import useCustomers from '../hooks/useCustomers';
import useDebounce from '../hooks/useDebounce';
import withRole from '../hoc/withRole';
import CustomerTable from '../components/CustomerTable';

const Manager1Dashboard = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const { customers, totalPages, updateCustomer } = useCustomers(debouncedSearch, page, 5);

    const handleAction = (id, type) => {
        if (type === 'evaluate') {
            updateCustomer(id, { limitStatus: 'Limit Set' });
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
                <strong>Action Required:</strong> Please verify the credit scores below. Clicking evaluate will move the application to the Limit Setting stage.
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
        </Box>
    );
};

export default withRole(Manager1Dashboard, ['MANAGER1', 'ADMIN', 'SUPER_ADMIN']);
