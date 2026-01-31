import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const CustomerTable = ({ customers, role, onAction }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'success';
      case 'pending':
      case 'limit set':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="customer table">
        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email / Phone</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">Credit Score</TableCell>

            {(role === 'MANAGER2' || role === 'SUPER_ADMIN' || role === 'ADMIN') && (
              <TableCell sx={{ fontWeight: 700 }} align="center">Approved Limit</TableCell>
            )}

            <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#fdfdfd' } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {customer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{customer.email}</Typography>
                    <Typography variant="caption" color="text.disabled">{customer.phone}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                      label={customer.creditScore}
                      color={customer.creditScore >= 800 ? 'success' : customer.creditScore >= 700 ? 'primary' : customer.creditScore >= 600 ? 'warning' : 'error'}
                      variant={customer.creditScore >= 800 ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    {customer.creditScore >= 800 && (
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800, fontSize: '9px', textTransform: 'uppercase' }}>
                        🚀 Fast Track
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {(role === 'MANAGER2' || role === 'SUPER_ADMIN' || role === 'ADMIN') && (
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {customer.approvedLimit > 0 ? `₹${customer.approvedLimit.toLocaleString()}` : '—'}
                    </Typography>
                  </TableCell>
                )}

                <TableCell align="center">
                  <Chip
                    label={customer.finalStatus || customer.limitStatus}
                    color={getStatusColor(customer.finalStatus || customer.limitStatus)}
                    size="small"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="View History">
                      <IconButton size="small" color="primary" onClick={() => onAction(customer.id, 'view', customer.history)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {role === 'MANAGER1' && customer.limitStatus === 'Pending' && (
                      <Tooltip title="Evaluate Score">
                        <IconButton size="small" color="success" onClick={() => onAction(customer.id, 'evaluate')}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {role === 'MANAGER2' && customer.limitStatus === 'Limit Set' && (
                      <Tooltip title="Approve Limit">
                        <IconButton size="small" color="success" onClick={() => onAction(customer.id, 'approve')}>
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => onAction(customer.id, 'reject')}>
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">No customers found matching your search.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerTable;
