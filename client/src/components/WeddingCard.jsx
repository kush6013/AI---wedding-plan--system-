// WeddingCard - displays a wedding summary in a card format
// Used on the Dashboard page to list all weddings

import { Link } from 'react-router-dom';

const WeddingCard = ({ wedding }) => {
  // Format the wedding date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="wedding-card">
      {/* Card header with couple name */}
      <div className="card-header">
        <h3 className="card-title">{wedding.coupleName}</h3>
        <span className="card-badge">{wedding.functions?.length || 0} Functions</span>
      </div>

      {/* Card body with wedding details */}
      <div className="card-body">
        <div className="card-info">
          <span className="info-label">Client:</span>
          <span className="info-value">{wedding.clientName}</span>
        </div>
        <div className="card-info">
          <span className="info-label">Date:</span>
          <span className="info-value">{formatDate(wedding.weddingDate)}</span>
        </div>
        <div className="card-info">
          <span className="info-label">Location:</span>
          <span className="info-value">
            {wedding.weddingLocation}
            {wedding.weddingCity ? `, ${wedding.weddingCity}` : ''}
          </span>
        </div>
        <div className="card-info">
          <span className="info-label">Theme:</span>
          <span className="info-value">{wedding.weddingTheme || 'Not specified'}</span>
        </div>
        {wedding.guestCount > 0 && (
          <div className="card-info">
            <span className="info-label">Guests:</span>
            <span className="info-value">{wedding.guestCount}</span>
          </div>
        )}
      </div>

      {/* Card footer with action links */}
      <div className="card-footer">
        <Link to={`/wedding/${wedding._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
        <Link to={`/wedding/${wedding._id}/video-plan`} className="btn btn-secondary btn-sm">
          Video Plan
        </Link>
        <Link to={`/wedding/${wedding._id}/album`} className="btn btn-secondary btn-sm">
          Album Design
        </Link>
      </div>
    </div>
  );
};

export default WeddingCard;
