import React from 'react';
import withRole from '../hoc/withRole';
import useCards from '../hooks/useCards';
import '../pages/Dashboard.css';

const AdminDashboard = () => {
    const { cards } = useCards();

    return (
        <div className="dashboard-container">
            <header className="dash-header">
                <div>
                    <h1>Admin Control Center</h1>
                    <p>System Overview & Analytics</p>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Total Users</h4>
                    <p className="stat-val">2,450</p>
                </div>
                <div className="stat-card">
                    <h4>Active Cards</h4>
                    <p className="stat-val">{cards.length}</p>
                </div>
                <div className="stat-card">
                    <h4>Applications</h4>
                    <p className="stat-val">128</p>
                </div>
            </div>

            <div className="recent-activity">
                <h3>System Activities</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <span>Success</span>
                        <p>Super Admin logged in from Bangalore, IN</p>
                        <small>2 minutes ago</small>
                    </div>
                    <div className="activity-item">
                        <span>Warning</span>
                        <p>Database backup partially completed</p>
                        <small>1 hour ago</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRole(AdminDashboard, ['ADMIN', 'SUPER_ADMIN']);
