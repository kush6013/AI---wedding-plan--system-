// WeddingDetails.jsx - Shows full details of a single wedding
// Displays wedding info, functions list, and provides AI generation buttons

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getWeddingById,
  deleteWedding,
  deleteFunction,
  createFunction,
} from '../services/api';
import FunctionCard from '../components/FunctionCard';
import Button from '../components/Button';
import Loading from '../components/Loading';

const WeddingDetails = () => {
  // useParams() gets the URL parameters - in this case, the wedding :id
  const { id } = useParams();
  const navigate = useNavigate();

  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddFunction, setShowAddFunction] = useState(false);
  const [newFunction, setNewFunction] = useState({
    functionName: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    description: '',
    importance: 'medium',
  });
  const [addingFunction, setAddingFunction] = useState(false);

  // Fetch wedding details when the page loads
  useEffect(() => {
    const fetchWedding = async () => {
      try {
        setLoading(true);
        const response = await getWeddingById(id);
        setWedding(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load wedding details');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  // Handle deleting the entire wedding
  const handleDeleteWedding = async () => {
    if (!window.confirm('Are you sure you want to delete this wedding? This cannot be undone.')) {
      return;
    }

    try {
      await deleteWedding(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete wedding');
    }
  };

  // Handle deleting a single function
  const handleDeleteFunction = async (functionId) => {
    if (!window.confirm('Remove this function?')) return;

    try {
      await deleteFunction(functionId);
      // Refresh wedding data to show updated functions list
      const response = await getWeddingById(id);
      setWedding(response.data);
    } catch (err) {
      setError(err.message || 'Failed to delete function');
    }
  };

  // Handle adding a new function
  const handleAddFunction = async (e) => {
    e.preventDefault();
    if (!newFunction.functionName || !newFunction.date) {
      setError('Function name and date are required');
      return;
    }

    try {
      setAddingFunction(true);
      await createFunction({
        wedding: id,
        ...newFunction,
      });

      // Refresh wedding data
      const response = await getWeddingById(id);
      setWedding(response.data);

      // Reset form
      setNewFunction({
        functionName: '',
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        description: '',
        importance: 'medium',
      });
      setShowAddFunction(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to add function');
    } finally {
      setAddingFunction(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Loading message="Loading wedding details..." />;
  }

  if (!wedding) {
    return (
      <div className="error-page">
        <h2>Wedding not found</h2>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="wedding-details-page">
      <div className="page-header">
        <div>
          <Link to="/dashboard" className="back-link">&larr; Back to Dashboard</Link>
          <h1>{wedding.coupleName}</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-danger btn-sm" onClick={handleDeleteWedding}>
            Delete Wedding
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Wedding Info Card */}
      <div className="wedding-info-card">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Client</span>
            <span className="info-value">{wedding.clientName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{wedding.email}</span>
          </div>
          {wedding.phone && (
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{wedding.phone}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Wedding Date</span>
            <span className="info-value">{formatDate(wedding.weddingDate)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">
              {wedding.weddingLocation}
              {wedding.weddingCity ? `, ${wedding.weddingCity}` : ''}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Theme</span>
            <span className="info-value">{wedding.weddingTheme || 'Not specified'}</span>
          </div>
          {wedding.guestCount > 0 && (
            <div className="info-item">
              <span className="info-label">Expected Guests</span>
              <span className="info-value">{wedding.guestCount}</span>
            </div>
          )}
        </div>
        {wedding.weddingDescription && (
          <div className="info-description">
            <span className="info-label">Description</span>
            <p>{wedding.weddingDescription}</p>
          </div>
        )}
      </div>

      {/* AI Generation Actions */}
      <div className="ai-actions-section">
        <h2>AI Planning Tools</h2>
        <div className="ai-actions-grid">
          <Link to={`/wedding/${id}/video-plan`} className="ai-action-card">
            <div className="ai-action-icon">&#127909;</div>
            <h3>Generate Function Video Plan</h3>
            <p>Get detailed shot lists and editing notes for each function</p>
          </Link>
          <Link to={`/wedding/${id}/highlight`} className="ai-action-card">
            <div className="ai-action-icon">&#127916;</div>
            <h3>Generate Highlight Video Plan</h3>
            <p>Create an overall wedding highlight video structure</p>
          </Link>
          <Link to={`/wedding/${id}/album`} className="ai-action-card">
            <div className="ai-action-icon">&#128247;</div>
            <h3>Generate Album Design</h3>
            <p>Get AI-assisted album themes, layouts, and color palettes</p>
          </Link>
        </div>
      </div>

      {/* Functions Section */}
      <div className="functions-section">
        <div className="section-header-row">
          <h2>Wedding Functions ({wedding.functions?.length || 0})</h2>
          <Button
            variant="secondary"
            onClick={() => setShowAddFunction(!showAddFunction)}
          >
            {showAddFunction ? 'Cancel' : '+ Add Function'}
          </Button>
        </div>

        {/* Add Function Form */}
        {showAddFunction && (
          <div className="add-function-inline">
            <form onSubmit={handleAddFunction}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Function Name *</label>
                  <input
                    type="text"
                    value={newFunction.functionName}
                    onChange={(e) =>
                      setNewFunction((prev) => ({ ...prev, functionName: e.target.value }))
                    }
                    placeholder="e.g., Haldi"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={newFunction.date}
                    onChange={(e) =>
                      setNewFunction((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newFunction.startTime}
                    onChange={(e) =>
                      setNewFunction((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newFunction.endTime}
                    onChange={(e) =>
                      setNewFunction((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    value={newFunction.venue}
                    onChange={(e) =>
                      setNewFunction((prev) => ({ ...prev, venue: e.target.value }))
                    }
                    placeholder="Function venue"
                  />
                </div>
                <div className="form-group">
                  <label>Importance</label>
                  <select
                    value={newFunction.importance}
                    onChange={(e) =>
                      setNewFunction((prev) => ({ ...prev, importance: e.target.value }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={newFunction.description}
                  onChange={(e) =>
                    setNewFunction((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe this function..."
                  rows="2"
                />
              </div>
              <Button type="submit" variant="primary" disabled={addingFunction}>
                {addingFunction ? 'Adding...' : 'Add Function'}
              </Button>
            </form>
          </div>
        )}

        {/* Functions List */}
        {wedding.functions && wedding.functions.length > 0 ? (
          <div className="functions-grid">
            {wedding.functions.map((func) => (
              <FunctionCard
                key={func._id}
                func={func}
                onDelete={handleDeleteFunction}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No functions added yet. Add your first function above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingDetails;
