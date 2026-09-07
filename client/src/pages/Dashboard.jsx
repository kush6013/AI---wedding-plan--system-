// Dashboard.jsx - Shows all weddings and statistics
// This is the main overview page for admins and clients

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWeddings } from '../services/api';
import WeddingCard from '../components/WeddingCard';
import Loading from '../components/Loading';

const Dashboard = () => {
  // State to hold all weddings
  const [weddings, setWeddings] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Error state
  const [error, setError] = useState('');

  // Fetch all weddings when the page loads
  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const response = await getAllWeddings();
        setWeddings(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load weddings');
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  // Calculate statistics
  const totalWeddings = weddings.length;
  const totalFunctions = weddings.reduce(
    (sum, w) => sum + (w.functions?.length || 0),
    0
  );
  const totalClients = new Set(weddings.map((w) => w.email)).size;

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/create-wedding" className="btn btn-primary">
          + New Wedding
        </Link>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalWeddings}</div>
          <div className="stat-label">Total Weddings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalClients}</div>
          <div className="stat-label">Total Clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalFunctions}</div>
          <div className="stat-label">Total Functions</div>
        </div>
      </div>

      {/* Wedding Cards */}
      <div className="weddings-section">
        <h2>All Weddings</h2>

        {weddings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">&#128144;</div>
            <h3>No Weddings Yet</h3>
            <p>Create your first wedding to get started with AI planning.</p>
            <Link to="/create-wedding" className="btn btn-primary">
              Create Wedding
            </Link>
          </div>
        ) : (
          <div className="weddings-grid">
            {weddings.map((wedding) => (
              <WeddingCard key={wedding._id} wedding={wedding} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
