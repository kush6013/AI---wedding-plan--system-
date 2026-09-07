// FunctionCard - displays a single wedding function
// Shows function name, date, time, venue, and importance level

const FunctionCard = ({ func, onDelete }) => {
  // Format the function date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Map importance level to a color class
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'critical': return 'importance-critical';
      case 'high': return 'importance-high';
      case 'medium': return 'importance-medium';
      case 'low': return 'importance-low';
      default: return 'importance-medium';
    }
  };

  return (
    <div className="function-card">
      <div className="function-card-header">
        <h4 className="function-name">{func.functionName}</h4>
        <span className={`importance-badge ${getImportanceClass(func.importance)}`}>
          {func.importance || 'medium'}
        </span>
      </div>

      <div className="function-card-body">
        <div className="function-info">
          <span className="function-label">Date:</span>
          <span className="function-value">{formatDate(func.date)}</span>
        </div>
        {func.startTime && (
          <div className="function-info">
            <span className="function-label">Time:</span>
            <span className="function-value">
              {func.startTime}{func.endTime ? ` - ${func.endTime}` : ''}
            </span>
          </div>
        )}
        {func.venue && (
          <div className="function-info">
            <span className="function-label">Venue:</span>
            <span className="function-value">{func.venue}</span>
          </div>
        )}
        {func.description && (
          <p className="function-description">{func.description}</p>
        )}
      </div>

      {onDelete && (
        <div className="function-card-footer">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(func._id)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default FunctionCard;
