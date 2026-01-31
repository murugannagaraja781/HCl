import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import useCards from '../hooks/useCards';
import ApplicationForm from './ApplicationForm';

const CardList = ({ onApply, openAsPopup = true }) => {
    const navigate = useNavigate();
    const { cards, loading, error } = useCards();
    const [showForm, setShowForm] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const cardForForm = (card) => ({
      id: card._id,
      name: card.cardName,
      cardType: card.cardType,
      annualFee: card.annualFee,
      benefits: card.benefits
    });

    const handleApply = (card) => {
        const cardData = cardForForm(card);
        if (openAsPopup) {
            setSelectedCard(cardData);
            setShowForm(true);
            onApply && onApply(cardData);
        } else {
            navigate('/apply', { state: { card: cardData, from: 'dashboard' } });
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>{error}</Typography>;

    return (
        <Box>
            <Grid container spacing={4}>
                {cards.map(card => (
                    <Grid item xs={12} sm={6} md={4} key={card._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', borderRadius: 4, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={card.imageUrl}
                                alt={card.cardName}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                                    {card.cardType}
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 800 }}>
                                    {card.cardName}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 700 }}>
                                    Annual Fee: ₹{card.annualFee.toLocaleString()}
                                </Typography>
                                <List dense sx={{ mb: 2 }}>
                                    {card.benefits.map((benefit, index) => (
                                        <ListItem key={index} disableGutters>
                                            <ListItemIcon sx={{ minWidth: 28 }}>
                                                <CheckIcon fontSize="small" color="success" />
                                            </ListItemIcon>
                                            <ListItemText primary={benefit} primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleApply(card)}
                                    sx={{ py: 1.2 }}
                                >
                                    Apply Now
                                </Button>
                                <Button
                                    variant="text"
                                    color="inherit"
                                    fullWidth
                                    onClick={() => navigate('/apply', { state: { card: cardForForm(card), from: 'dashboard' } })}
                                    sx={{ fontSize: '12px', opacity: 0.7 }}
                                >
                                    View in new page
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {showForm && selectedCard && (
                <ApplicationForm
                    card={selectedCard}
                    onClose={() => { setShowForm(false); setSelectedCard(null); }}
                />
            )}
        </Box>
    );
};

export default CardList;
