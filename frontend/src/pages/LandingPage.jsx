import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationStatusCheck from '../components/ApplicationStatusCheck';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [showStatusCheck, setShowStatusCheck] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const categories = ['All', 'Travel', 'Cashback', 'Rewards', 'Premium'];

    const cards = [
        {
            id: 1,
            name: 'HCL Blue Signature',
            category: 'Premium',
            image: '/assets/card-blue.png',
            desc: 'Exclusive rewards for global travelers.',
            benefits: ['Lounge Access', '5x Travel Points']
        },
        {
            id: 2,
            name: 'HCL Platinum Plus',
            category: 'Rewards',
            image: '/assets/card-platinum.png',
            desc: 'The benchmark for premium spending.',
            benefits: ['No Annual Fee', '1% Cashback']
        },
        {
            id: 3,
            name: 'HCL Business Gold',
            category: 'Cashback',
            image: '/assets/card-group.jpg',
            desc: 'Powerful tools for your business.',
            benefits: ['Business Insurance', '2% Cashback']
        }
    ];

    const filteredCards = selectedCategory === 'All'
        ? cards
        : cards.filter(c => c.category === selectedCategory);

    const handleApply = (card) => {
        setSelectedCard(card);
        setShowForm(true);
    };

    return (
        <div className="landing-container">
            <nav className="navbar">
                <div className="logo">HCL Bank</div>
                <div className="nav-links">
                    <button onClick={() => navigate('/login')} className="login-pill">Login</button>
                </div>
            </nav>

            <header className="hero">
                <div className="hero-content slide-in-bottom">
                    <h1>The Future of <span className="gradient-text">Credit</span> is Here</h1>
                    <p>Designed for your lifestyle. Seamless, secure, and rewarding.</p>
                    <div className="hero-btns">
                        <button className="btn-primary">Explore Now</button>
                        <button className="btn-secondary" onClick={() => setShowStatusCheck(true)}>Check Application Status</button>
                    </div>
                </div>
            </header>

            <section className="categories-section fade-in">
                <h2>Find Your Perfect Match</h2>
                <div className="category-list">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="card-showcase">
                    {filteredCards.map(card => (
                        <div key={card.id} className="modern-card stagger-item">
                            <div className="card-visual">
                                <img src={card.image} alt={card.name} />
                            </div>
                            <div className="card-info">
                                <h3>{card.name}</h3>
                                <p>{card.desc}</p>
                                <button onClick={() => handleApply(card)} className="apply-btn-modern">Apply Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {showForm && (
                <ApplicationForm
                    card={selectedCard}
                    onClose={() => setShowForm(false)}
                />
            )}
            {showStatusCheck && (
                <ApplicationStatusCheck onClose={() => setShowStatusCheck(false)} />
            )}
        </div>
    );
};

export default LandingPage;
