import React, { useState, useCallback } from 'react';
import useCustomers from '../hooks/useCustomers';
import useDebounce from '../hooks/useDebounce';
import withRole from '../hoc/withRole';
import '../pages/Dashboard.css';

const Manager2Dashboard = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const { customers, totalPages, updateCustomer } = useCustomers(debouncedSearch, page);

    const handleApproveLimit = useCallback((id, limit) => {
        updateCustomer(id, { approvedLimit: limit, limitStatus: 'Limit Set' });
        alert(`Credit limit of ₹${limit} requested for Approval.`);
    }, [updateCustomer]);

    return (
        <div className="dashboard-container m2-theme">
            <header className="dash-header">
                <div>
                    <h1>Manager Level 2</h1>
                    <p>Credit Limit Approval & Assignment</p>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Filter by Customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="customer-table-container">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Credit Score</th>
                            <th>Current Limit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.creditScore}</td>
                                <td>₹{c.approvedLimit || '0'}</td>
                                <td>
                                    <span className={`status-pill ${c.limitStatus.toLowerCase().replace(' ', '-')}`}>
                                        {c.limitStatus}
                                    </span>
                                </td>
                                <td>
                                    <div className="limit-actions">
                                        <button onClick={() => handleApproveLimit(c.id, 100000)} className="limit-btn">₹1L</button>
                                        <button onClick={() => handleApproveLimit(c.id, 500000)} className="limit-btn blue">₹5L</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
};

export default withRole(Manager2Dashboard, ['MANAGER2', 'ADMIN', 'SUPER_ADMIN']);
