import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import useCards from '../hooks/useCards';
import withRole from '../hoc/withRole';

const ManagerDashboard = () => {
    const { cards, addCard, loading } = useCards();
    const [open, setOpen] = useState(false);
    const [newCard, setNewCard] = useState({
        cardName: '',
        cardType: 'Visa',
        benefits: '',
        annualFee: 0,
        description: '',
        imageUrl: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formattedCard = {
            ...newCard,
            benefits: newCard.benefits.split(',').map(b => b.trim())
        };

        const result = await addCard(formattedCard);
        if (result.success) {
            setStatus({ type: 'success', msg: 'Product added successfully!' });
            setOpen(false);
            setNewCard({ cardName: '', cardType: 'Visa', benefits: '', annualFee: 0, description: '', imageUrl: '' });
        } else {
            setStatus({ type: 'error', msg: result.message });
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        Product Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage HCL Credit Card lifecycle and benefits.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ px: 3, py: 1.2 }}
                >
                    Add New Product
                </Button>
            </Box>

            {status.msg && <Alert severity={status.type} sx={{ mb: 3 }} onClose={() => setStatus({type:'', msg:''})}>{status.msg}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Card Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Annual Fee</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={24} /></TableCell></TableRow>
                        ) : (
                            cards.map((card) => (
                                <TableRow key={card._id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{card.cardName}</TableCell>
                                    <TableCell>{card.cardType}</TableCell>
                                    <TableCell>₹{card.annualFee.toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton color="error" size="small"><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Add New Credit Card</DialogTitle>
                <form onSubmit={handleAddProduct}>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Card Name"
                                    fullWidth
                                    required
                                    value={newCard.cardName}
                                    onChange={e => setNewCard({...newCard, cardName: e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Card Type"
                                    fullWidth
                                    value={newCard.cardType}
                                    onChange={e => setNewCard({...newCard, cardType: e.target.value})}
                                >
                                    <MenuItem value="Visa">Visa</MenuItem>
                                    <MenuItem value="Mastercard">Mastercard</MenuItem>
                                    <MenuItem value="Platinum">Platinum</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Annual Fee (₹)"
                                    type="number"
                                    fullWidth
                                    required
                                    value={newCard.annualFee}
                                    onChange={e => setNewCard({...newCard, annualFee: e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Image URL"
                                    fullWidth
                                    value={newCard.imageUrl}
                                    onChange={e => setNewCard({...newCard, imageUrl: e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Benefits (comma separated)"
                                    fullWidth
                                    value={newCard.benefits}
                                    onChange={e => setNewCard({...newCard, benefits: e.target.value})}
                                    placeholder="Lounge Access, 5% Cashback..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    required
                                    value={newCard.description}
                                    onChange={e => setNewCard({...newCard, description: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Save Product</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default withRole(ManagerDashboard, ['MANAGER', 'ADMIN', 'SUPER_ADMIN']);
