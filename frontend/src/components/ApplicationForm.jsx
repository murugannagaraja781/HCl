import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  getCreditLimit,
  formatCurrency,
  isValidPAN,
  getAge,
  MIN_APPLICANT_AGE,
} from '../utils/creditCardUtils';
import './ApplicationForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DUMMY_FORM_DATA = {
  fullName: 'Rahul Kumar Sharma',
  email: 'rahul.sharma@example.com',
  phone: '9876543210',
  dateOfBirth: '1995-06-15',
  pan: 'ABCDE1234F',
  annualIncome: '450000',
  address: '42 MG Road, Bangalore, Karnataka 560001',
};

const ApplicationForm = ({ card, onClose, variant = 'popup' }) => {
  const isPopup = variant === 'popup';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    pan: '',
    annualIncome: '',
    address: '',
  });
  const [creditScore, setCreditScore] = useState(null);
  const [creditScoreLoading, setCreditScoreLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState(null);
  const [checkingPrevious, setCheckingPrevious] = useState(false);

  const creditLimitInfo = getCreditLimit(formData.annualIncome);
  const age = getAge(formData.dateOfBirth);
  const isAgeValid = age !== null && age >= MIN_APPLICANT_AGE;
  const panValid = !formData.pan || isValidPAN(formData.pan);

  const fetchCreditScore = useCallback(async (pan) => {
    if (!isValidPAN(pan)) {
      setCreditScore(null);
      return;
    }
    setCreditScoreLoading(true);
    setCreditScore(null);
    try {
      const res = await axios.get(`${API_URL}/api/credit-score`, {
        params: { pan: pan.trim().toUpperCase() },
      }).catch(() => null);
      if (res?.data?.score != null) {
        setCreditScore(res.data.score);
      } else {

        const simulated = 600 + Math.floor(Math.random() * 250);
        setCreditScore(simulated);
      }
    } catch {
      const simulated = 600 + Math.floor(Math.random() * 250);
      setCreditScore(simulated);
    } finally {
      setCreditScoreLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!formData.pan || formData.pan.length < 10) return;
    const t = setTimeout(() => fetchCreditScore(formData.pan), 500);
    return () => clearTimeout(t);
  }, [formData.pan, fetchCreditScore]);

  const handleProceedToOTP = (e) => {
    e.preventDefault();
    setError('');

    if (age !== null && age < MIN_APPLICANT_AGE) {
      setError(`Applicant must be at least ${MIN_APPLICANT_AGE} years old. Current age: ${age}.`);
      return;
    }
    if (!panValid) {
      setError('Please enter a valid PAN (e.g. ABCDE1234F).');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setCheckingPrevious(true);

    // Simulate finding a recent application (dummy logic)
    const mockRecentApps = ['ABCDE1234F', 'XYZPQ9876S'];
    const isRecent = mockRecentApps.includes(formData.pan.trim().toUpperCase());

    setTimeout(() => {
      if (isRecent) {
        setError(
          'A previous application was Approved or Rejected in the last 6 months for this PAN. You cannot apply again yet.'
        );
        setCheckingPrevious(false);
      } else {
        setStep(2);
        setCheckingPrevious(false);
      }
    }, 800);
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setError('');
    }, 1500);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsVerifying(true);
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
    setError('');
    const payload = {
      cardId: card?.id,
      cardName: card?.name,
      ...formData,
      pan: formData.pan.trim().toUpperCase(),
      creditScore,
      creditLimit: creditLimitInfo.type === 'fixed' ? creditLimitInfo.amount : null,
      creditLimitType: creditLimitInfo.type,
    };
    setIsVerifying(true);
    axios
      .post(`${API_URL}/api/applications`, payload)
      .then((res) => {
        const appNum = res?.data?.applicationNumber || `HCL-${Date.now().toString(36).toUpperCase().slice(-8)}`;
        setApplicationNumber(appNum);
        setSubmitted(true);
        setIsVerifying(false);
      })
      .catch(() => {
        setApplicationNumber(`HCL-${Date.now().toString(36).toUpperCase().slice(-8)}`);
        setSubmitted(true);
        setIsVerifying(false);
      });
  };

  const content = (
    <div className={`modal-content scale-up application-form-modal ${!isPopup ? 'application-form-page-content' : ''}`}>
      <button type="button" className="close-btn" onClick={onClose} aria-label={isPopup ? 'Close' : 'Back'}>
        {isPopup ? '×' : '← Back'}
      </button>
        {submitted ? (
          <div className="success-msg">
            <div className="check-icon">✓</div>
            <h2>Application Submitted!</h2>
            <p>
              Your application for <strong>{card?.name}</strong> is under review.
            </p>
            <p className="application-number">
              Application number: <strong>{applicationNumber}</strong>
            </p>
            <p className="status-hint">
              Save this number. You can check your application status anytime using this number.
            </p>
            <button type="button" onClick={onClose} className="submit-btn">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="step-indicator">
              <span className={step >= 1 ? 'active' : ''}>1</span>
              <div className={`line ${step === 2 ? 'active' : ''}`}></div>
              <span className={step === 2 ? 'active' : ''}>2</span>
            </div>

            <h2>
              {step === 1 ? `Apply for ${card?.name}` : 'Verify Your Number'}
            </h2>
            {error && <p className="error-msg-small">{error}</p>}

            {step === 1 ? (
              <form onSubmit={handleProceedToOTP} className="application-form-form">
                <button type="button" className="demo-data-btn" onClick={() => setFormData(DUMMY_FORM_DATA)}>
                  Fill with demo data
                </button>
                <div className="form-fields-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="As per ID"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                  {formData.dateOfBirth && (
                    <span className={`field-hint ${isAgeValid ? 'valid' : 'invalid'}`}>
                      Age: {age != null ? age : '—'} years
                      {!isAgeValid && age != null && (
                        <span> (must be {MIN_APPLICANT_AGE}+)</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>PAN *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.pan}
                    onChange={(e) =>
                      setFormData({ ...formData, pan: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })
                    }
                    placeholder="ABCDE1234F"
                    className={!panValid && formData.pan.length >= 10 ? 'input-invalid' : ''}
                  />
                  {creditScoreLoading && <span className="field-hint">Fetching credit score…</span>}
                  {creditScore != null && !creditScoreLoading && (
                    <span className="field-hint valid">Credit score: {creditScore}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Annual Income (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    placeholder="e.g. 500000"
                  />
                  {formData.annualIncome && (
                    <span className="field-hint valid">
                      Credit limit:{' '}
                      {creditLimitInfo.type === 'fixed'
                        ? `₹${formatCurrency(creditLimitInfo.amount)}`
                        : 'Subject to bank approval'}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10 digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>
                <div className="form-group form-group-full">
                  <label>Address (optional)</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Current address"
                    className="form-input"
                  />
                </div>
                </div>
                <button
                  type="submit"
                  disabled={checkingPrevious || creditScoreLoading}
                  className="submit-btn"
                >
                  {checkingPrevious ? 'Checking eligibility…' : 'Continue to Verify'}
                </button>
              </form>
            ) : (
              <div className="otp-section">
                {!isVerified ? (
                  <form onSubmit={handleVerifyOTP}>
                    <p>
                      Enter the 4-digit code sent to <strong>{formData.phone}</strong>
                    </p>
                    <input
                      type="text"
                      className="otp-input"
                      maxLength={4}
                      placeholder="••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="submit-btn primary"
                    >
                      {isVerifying ? 'Verifying…' : 'Verify OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="back-btn"
                    >
                      Change Number
                    </button>
                  </form>
                ) : (
                  <div className="verified-view slide-in-bottom">
                    <div className="status-badge success">✓ Phone Verified</div>
                    <p>You can now submit your application.</p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isVerifying}
                      className="submit-btn final"
                    >
                      {isVerifying ? 'Submitting…' : 'Submit Application'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
    </div>
  );

  if (isPopup) {
    return <div className="modal-overlay">{content}</div>;
  }
  return <div className="application-form-page">{content}</div>;
};

export default ApplicationForm;
