import React, { useState } from 'react';
import useCards from '../hooks/useCards';
import withRole from '../hoc/withRole';
import '../pages/Dashboard.css';

const ManagerDashboard = () => {
    const { cards, addCard, loading } = useCards();
    const [showAddForm, setShowAddForm] = useState(false);
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
            setShowAddForm(false);
            setNewCard({ cardName: '', cardType: 'Visa', benefits: '', annualFee: 0, description: '', imageUrl: '' });
        } else {
            setStatus({ type: 'error', msg: result.message });
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dash-header">
                <div>
                    <h1>Manager Dashboard</h1>
                    <p>Manage HCL Credit Card Products</p>
                </div>
                <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : '+ Add New Product'}
                </button>
            </header>

            {status.msg && <div className={`alert ${status.type}`}>{status.msg}</div>}

            {showAddForm && (
                <div className="add-product-form slide-in-bottom">
                    <h3>Add New Credit Card</h3>
                    <form onSubmit={handleAddProduct}>
                        <div className="form-grid">
                            <div className="f-group">
                                <label>Card Name</label>
                                <input type="text" value={newCard.cardName} onChange={e => setNewCard({...newCard, cardName: e.target.value})} required />
                            </div>
                            <div className="f-group">
                                <label>Card Type</label>
                                <select value={newCard.cardType} onChange={e => setNewCard({...newCard, cardType: e.target.value})}>
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="Platinum">Platinum</option>
                                </select>
                            </div>
                            <div className="f-group">
                                <label>Annual Fee (₹)</label>
                                <input type="number" value={newCard.annualFee} onChange={e => setNewCard({...newCard, annualFee: e.target.value})} required />
                            </div>
                            <div className="f-group">
                                <label>Image URL</label>
                                <input type="text" value={newCard.imageUrl} onChange={e => setNewCard({...newCard, imageUrl: e.target.value})} placeholder="https://..." />
                            </div>
                        </div>
                        <div className="f-group">
                            <label>Benefits (comma separated)</label>
                            <input type="text" value={newCard.benefits} onChange={e => setNewCard({...newCard, benefits: e.target.value})} placeholder="Lounge Access, 5% Cashback..." />
                        </div>
                        <div className="f-group">
                            <label>Description</label>
                            <textarea value={newCard.description} onChange={e => setNewCard({...newCard, description: e.target.value})} required></textarea>
                        </div>
                        <button type="submit" className="save-btn">Save Product</button>
                    </form>
                </div>
            )}

            <div className="product-list">
                <h3>Current Inventory</h3>
                {loading ? <p>Loading cards...</p> : (
                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Fee</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map(card => (
                                <tr key={card._id}>
                                    <td>{card.cardName}</td>
                                    <td>{card.cardType}</td>
                                    <td>₹{card.annualFee}</td>
                                    <td><button className="edit-btn">Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default withRole(ManagerDashboard, ['MANAGER', 'ADMIN', 'SUPER_ADMIN']);
