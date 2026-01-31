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

const Manager2Dashboard = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const { customers, totalPages, updateCustomer } = useCustomers(debouncedSearch, page, 5);

    const handleAction = (id, type) => {
        if (type === 'approve') {
            updateCustomer(id, { finalStatus: 'Approved', limitStatus: 'Approved' });
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                        Limit Approval
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Assign and approve final credit limits for applicants.
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

            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                <strong>Final Stage:</strong> These applications have passed the initial evaluation. Review the suggested limits and provide final approval.
            </Alert>

            <CustomerTable
                customers={customers}
                role="MANAGER2"
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

export default withRole(Manager2Dashboard, ['MANAGER2', 'ADMIN', 'SUPER_ADMIN']);
