import React, { useState } from 'react';
import './ApplicationForm.css';

const ApplicationForm = ({ card, onClose }) => {
    const [step, setStep] = useState(1); // 1: Info, 2: OTP
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        income: ''
    });
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (formData.phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setIsVerifying(true);
        // Simulate MSG91 OTP Send
        setTimeout(() => {
            setIsVerifying(false);
            setStep(2);
            setError('');
            console.log('OTP Sent to', formData.phone);
        }, 1500);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setIsVerifying(true);
        // Simulate OTP Verification (Match '1234')
        setTimeout(() => {
            if (otp === '1234') {
                setIsVerified(true);
                setIsVerifying(false);
                setError('');
            } else {
                setError('Invalid OTP. Please try again.');
                setIsVerifying(false);
            }
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content scale-up">
                <button className="close-btn" onClick={onClose}>&times;</button>
                {submitted ? (
                    <div className="success-msg">
                        <div className="check-icon">✓</div>
                        <h2>Application Submitted!</h2>
                        <p>Success! Your application for <strong>{card?.name}</strong> is under review.</p>
                        <p>Reference: #HCL-{Math.floor(Math.random() * 900000) + 100000}</p>
                    </div>
                ) : (
                    <>
                        <div className="step-indicator">
                            <span className={step >= 1 ? 'active' : ''}>1</span>
                            <div className={`line ${step === 2 ? 'active' : ''}`}></div>
                            <span className={step === 2 ? 'active' : ''}>2</span>
                        </div>

                        <h2>{step === 1 ? `Apply for ${card?.name}` : 'Verify Your Number'}</h2>
                        {error && <p className="error-msg-small">{error}</p>}

                        {step === 1 ? (
                            <form onSubmit={handleSendOTP}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" required placeholder="Enter 10 digit mobile" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Annual Income (₹)</label>
                                    <input type="number" required value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} />
                                </div>
                                <button type="submit" disabled={isVerifying} className="submit-btn">
                                    {isVerifying ? 'Sending...' : 'Continue to Verify'}
                                </button>
                            </form>
                        ) : (
                            <div className="otp-section">
                                {!isVerified ? (
                                    <form onSubmit={handleVerifyOTP}>
                                        <p>Enter the 4-digit code sent to <strong>{formData.phone}</strong></p>
                                        <input
                                            type="text"
                                            className="otp-input"
                                            maxLength="4"
                                            placeholder="••••"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            required
                                        />
                                        <button type="submit" disabled={isVerifying} className="submit-btn primary">
                                            {isVerifying ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                        <button type="button" onClick={() => setStep(1)} className="back-btn">Change Number</button>
                                    </form>
                                ) : (
                                    <div className="verified-view slide-in-bottom">
                                        <div className="status-badge success">✓ Phone Verified</div>
                                        <p>You can now submit your application.</p>
                                        <button onClick={handleSubmit} className="submit-btn final">Submit Application</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;
