import React, { useState } from 'react';
import axios from 'axios';
import './ApplicationForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const STATUS_LABELS = {
  PENDING: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUBMITTED: 'Submitted',
};

const ApplicationStatusCheck = ({ onClose }) => {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

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
    axios
      .get(`${API_URL}/api/applications/status`, {
        params: { applicationNumber: num },
      })
      .then((res) => {
        setStatus(res?.data || { status: 'PENDING', applicationNumber: num });
        setLoading(false);
      })
      .catch(() => {
        setStatus({
          applicationNumber: num,
          status: 'PENDING',
          message: 'Status could not be fetched. Showing placeholder.',
        });
        setLoading(false);
      });
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
