import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';

const ApplyPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const card = state?.card || null;

  const handleClose = () => {
    if (state?.from === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(-1);
    }
  };

  if (!card) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No card selected</h2>
        <p>Please choose a card from the Dashboard or Landing page to apply.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{ padding: '0.75rem 1.5rem', marginTop: '1rem', cursor: 'pointer' }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <ApplicationForm
      card={card}
      onClose={handleClose}
      variant="page"
    />
  );
};

export default ApplyPage;
