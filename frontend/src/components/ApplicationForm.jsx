import React, { useState } from 'react';
import './ApplicationForm.css';

const ApplicationForm = ({ card, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        income: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would call an API
        console.log('Form Submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content scale-up">
                <button className="close-btn" onClick={onClose}>&times;</button>
                {submitted ? (
                    <div className="success-msg">
                        <h2>Application Received!</h2>
                        <p>Our team will contact you shortly regarding your {card?.name}.</p>
                    </div>
                ) : (
                    <>
                        <h2>Apply for {card?.name}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Annual Income</label>
                                <input
                                    type="number"
                                    required
                                    onChange={e => setFormData({...formData, income: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="submit-btn">Submit Application</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;
