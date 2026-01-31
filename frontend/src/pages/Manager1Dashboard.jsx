import React, { useState, useCallback } from 'react';
import useCustomers from '../hooks/useCustomers';
import useDebounce from '../hooks/useDebounce';
import withRole from '../hoc/withRole';
import '../pages/Dashboard.css';

const Manager1Dashboard = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const { customers, totalPages, updateCustomer } = useCustomers(debouncedSearch, page);

    const handleCheckScore = useCallback((id) => {
        // In reality, this might call an API to fetch the latest score
        alert(`Refreshing credit score for customer ID: ${id}`);
    }, []);

    return (
        <div className="dashboard-container m1-theme">
            <header className="dash-header">
                <div>
                    <h1>Manager Level 1</h1>
                    <p>Credit Evaluation & Customer Details</p>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search Customers..."
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
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Credit Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>
                                    <span className={`score-badge ${c.creditScore > 750 ? 'high' : c.creditScore > 650 ? 'med' : 'low'}`}>
                                        {c.creditScore}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => handleCheckScore(c.id)} className="action-btn-small">Check Score</button>
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

export default withRole(Manager1Dashboard, ['MANAGER1', 'ADMIN', 'SUPER_ADMIN']);
