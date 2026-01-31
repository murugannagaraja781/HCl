import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardList = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
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
                        <button className="apply-btn">Apply Now</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardList;
