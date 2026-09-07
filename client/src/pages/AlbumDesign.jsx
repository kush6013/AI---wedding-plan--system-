// AlbumDesign.jsx - AI album design generation and display page
// Generates theme, color palette, page structure, and layout suggestions

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getWeddingById,
  getWeddingAlbumDesigns,
  generateAlbumDesign,
  deleteAlbumDesign,
} from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';

const AlbumDesign = () => {
  const { id } = useParams(); // wedding ID from URL

  const [wedding, setWedding] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [designToDelete, setDesignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch wedding details and existing album designs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weddingRes, designsRes] = await Promise.all([
          getWeddingById(id),
          getWeddingAlbumDesigns(id),
        ]);
        setWedding(weddingRes.data);
        setDesigns(designsRes.data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load album design data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Generate the album design
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await generateAlbumDesign(id);
      setResult(response.data);

      // Refresh designs list
      const designsRes = await getWeddingAlbumDesigns(id);
      setDesigns(designsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to generate album design');
      setResult(null);
    } finally {
      setGenerating(false);
    }
  };

  const viewDesign = (design) => {
    setResult(design);
  };

  // Show the confirmation dialog for a design the user wants to delete
  const askDelete = (design) => {
    setDesignToDelete(design);
  };

  // Delete the chosen design after the user confirms
  const handleDelete = async () => {
    if (!designToDelete) return;

    try {
      setDeleting(true);
      setError('');
      await deleteAlbumDesign(designToDelete._id);

      // Remove the deleted design from the list (filter keeps everything except it)
      setDesigns(designs.filter((d) => d._id !== designToDelete._id));

      // If the design that was being viewed got deleted, clear the result panel
      if (result && result._id === designToDelete._id) {
        setResult(null);
      }

      setDesignToDelete(null);
    } catch (err) {
      setError(err.message || 'Unable to delete album design. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const renderList = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <ul className="shot-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <Loading message="Loading album design..." />;
  }

  if (!wedding) {
    return (
      <div className="error-page">
        <h2>Wedding not found</h2>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="album-page">
      <div className="page-header">
        <div>
          <Link to={`/wedding/${id}`} className="back-link">&larr; Back to Wedding</Link>
          <h1>AI Album Design</h1>
          <p className="page-subtitle">{wedding.coupleName}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Generation Section */}
      <div className="generator-card">
        <h2>Generate Album Design Concept</h2>
        <p className="form-hint">
          Our AI will create album themes, color palettes, page structures, and layout suggestions
        </p>
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? 'Generating Album Design...' : 'Generate Album Design'}
        </Button>
      </div>

      {/* Result Display */}
      {result && result.aiOutput && (
        <div className="result-section">
          <div className="result-header">
            <h2>Album Design Concept</h2>
            <span className="result-badge">{result.aiOutput.albumTheme || result.theme}</span>
          </div>

          {/* Color Palette Display */}
          {result.aiOutput.colorPalette && result.aiOutput.colorPalette.length > 0 && (
            <div className="result-card">
              <h3>Color Palette</h3>
              <div className="color-palette">
                {result.aiOutput.colorPalette.map((color, index) => (
                  <div key={index} className="color-swatch-group">
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color, border: '1px solid #ddd' }}
                      title={color}
                    ></div>
                    <span className="color-name">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography */}
          {result.aiOutput.typographySuggestion && (
            <div className="result-card">
              <h3>Typography Suggestion</h3>
              <p>{result.aiOutput.typographySuggestion}</p>
            </div>
          )}

          {/* Cover Concept */}
          {result.aiOutput.coverConcept && (
            <div className="result-card">
              <h3>Cover Page Concept</h3>
              <p><strong>{result.aiOutput.coverConcept.title || 'Cover'}</strong></p>
              <p>{result.aiOutput.coverConcept.description}</p>
              {renderList(result.aiOutput.coverConcept.elements)}
            </div>
          )}

          {/* Page Structure */}
          {result.aiOutput.pageStructure && result.aiOutput.pageStructure.length > 0 && (
            <div className="result-card">
              <h3>Page Structure</h3>
              <div className="page-structure-table">
                <table>
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Section</th>
                      <th>Title</th>
                      <th>Photos</th>
                      <th>Layout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.aiOutput.pageStructure.map((page, index) => (
                      <tr key={index}>
                        <td>{page.pageNumber || index + 1}</td>
                        <td>{page.section}</td>
                        <td>{page.title}</td>
                        <td>{page.photoCount || '-'}</td>
                        <td>{page.layoutType || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.aiOutput.pageStructure[0]?.description && (
                  <p className="table-note">
                    {result.aiOutput.pageStructure[0].description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Layout Suggestions */}
          {result.aiOutput.layoutSuggestions && result.aiOutput.layoutSuggestions.length > 0 && (
            <div className="result-card">
              <h3>Layout Suggestions</h3>
              {result.aiOutput.layoutSuggestions.map((item, index) => (
                <div key={index} className="layout-item">
                  <strong>{item.section}:</strong> {item.suggestion}
                </div>
              ))}
            </div>
          )}

          {/* Photo Selection Advice */}
          {result.aiOutput.photoSelectionAdvice && result.aiOutput.photoSelectionAdvice.length > 0 && (
            <div className="result-card">
              <h3>Photo Selection Advice</h3>
              {renderList(result.aiOutput.photoSelectionAdvice)}
            </div>
          )}

          {/* Total Pages */}
          {result.aiOutput.totalRecommendedPages && (
            <div className="result-card">
              <h3>Total Recommended Pages</h3>
              <p>{result.aiOutput.totalRecommendedPages}</p>
            </div>
          )}

          {/* Closing Page */}
          {result.aiOutput.closingPageConcept && (
            <div className="result-card">
              <h3>Closing Page Concept</h3>
              <p>{result.aiOutput.closingPageConcept.description}</p>
              {renderList(result.aiOutput.closingPageConcept.elements)}
            </div>
          )}
        </div>
      )}

      {/* Saved Designs */}
      {designs.length > 0 && (
        <div className="saved-plans-section">
          <h2>Saved Album Designs ({designs.length})</h2>
          <div className="saved-plans-grid">
            {designs.map((design) => (
              <div
                key={design._id}
                className="saved-plan-card"
                onClick={() => viewDesign(design)}
              >
                <div className="saved-plan-title">
                  {design.aiOutput?.albumTheme || design.theme || 'Album Design'}
                </div>
                <div className="saved-plan-meta">
                  Pages: {design.aiOutput?.totalRecommendedPages || 'N/A'}
                </div>
                <div className="saved-plan-date">
                  {new Date(design.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <div className="saved-plan-actions">
                  <span className="view-now">Click to view</span>
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={deleting}
                    onClick={(e) => {
                      e.stopPropagation(); // don't open the design, only delete
                      askDelete(design);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation dialog shown when the user clicks Delete */}
      <ConfirmDialog
        open={!!designToDelete}
        title="Delete Album Design"
        message="Are you sure you want to delete this saved album design? This action cannot be undone."
        onCancel={() => setDesignToDelete(null)}
        onConfirm={handleDelete}
        confirming={deleting}
      />
    </div>
  );
};

export default AlbumDesign;