import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApplicationForm from './ApplicationForm';

const CardList = ({ onApply, openAsPopup = true }) => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const res = await axios.get(`${apiUrl}/api/cards`);
                setCards(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch credit cards');
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    const cardForForm = (card) => ({ id: card._id, name: card.cardName, cardType: card.cardType, annualFee: card.annualFee, benefits: card.benefits });

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

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <>
            <div className="card-grid">
                {cards.map(card => (
                    <div key={card._id} className="card-item">
                        <img src={card.imageUrl} alt={card.cardName} className="card-img" />
                        <div className="card-body">
                            <h3>{card.cardName}</h3>
                            <p className="card-type">{card.cardType}</p>
                            <p className="card-fee">Annual Fee: ${card.annualFee}</p>
                            <ul className="card-benefits">
                                {card.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                            <button type="button" className="apply-btn" onClick={() => handleApply(card)}>Apply Now</button>
                            <button type="button" className="apply-link" onClick={() => navigate('/apply', { state: { card: cardForForm(card), from: 'dashboard' } })}>Open form in new page</button>
                        </div>
                    </div>
                ))}
            </div>
            {showForm && selectedCard && (
                <ApplicationForm
                    card={selectedCard}
                    onClose={() => { setShowForm(false); setSelectedCard(null); }}
                />
            )}
        </>
    );
};

export default CardList;
