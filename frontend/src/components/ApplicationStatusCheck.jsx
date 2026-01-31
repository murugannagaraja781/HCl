import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './ApplicationForm.css';

const STATUS_LABELS = {
  PENDING: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUBMITTED: 'Submitted',
  'LIMIT SET': 'Credit Limit Assigned',
  ACTIVE: 'Active / Card Issued'
};

const ApplicationStatusCheck = ({ onClose }) => {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const { items: customers } = useSelector(state => state.customers);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = applicationNumber.trim();
    if (!num) {
      setError('Please enter your application number.');
      return;
    }
    setError('');
    setStatus(null);
    setLoading(true);

    // Simulate lookup in Redux store (Demo mode)
    setTimeout(() => {
        // Try to find by ID or Name for demo purposes
        const customer = customers.find(c =>
            c.id.toString() === num ||
            `HCL-${c.id}` === num ||
            c.name.toLowerCase().includes(num.toLowerCase())
        );

        if (customer) {
            setStatus({
                applicationNumber: `HCL-${customer.id}00${customer.id}`,
                status: (customer.finalStatus || customer.limitStatus).toUpperCase(),
                message: customer.finalStatus === 'Active' ? 'Your card is ready for use!' : 'Your application is progressing through our verification stages.'
            });
        } else {
            setError('Application number not found. Please try "1" or "John".');
        }
        setLoading(false);
    }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content scale-up application-form-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2>Check Application Status</h2>
        <p className="status-check-desc">Enter your application number to see the current status.</p>
        {error && <p className="error-msg-small">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application Number *</label>
            <input
              type="text"
              required
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              placeholder="e.g. HCL-ABC12XYZ"
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Checking…' : 'Check Status'}
          </button>
        </form>

        {status && (
          <div className={`status-result status-${(status.status || '').toLowerCase()}`}>
            <div className="status-result-badge">
              {STATUS_LABELS[status.status] || status.status || 'Unknown'}
            </div>
            <p className="status-app-num">Application: {status.applicationNumber}</p>
            {status.message && <p className="status-message">{status.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatusCheck;
