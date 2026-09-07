// VideoPlan.jsx - Function-wise AI video planning page
// Users can generate a video plan for each function and view the results

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getWeddingById,
  getWeddingVideoPlans,
  generateFunctionVideoPlan,
  deleteVideoPlan,
} from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';

const VideoPlan = () => {
  const { id } = useParams(); // wedding ID from URL

  const [wedding, setWedding] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch wedding details and existing plans on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weddingRes, plansRes] = await Promise.all([
          getWeddingById(id),
          getWeddingVideoPlans(id),
        ]);
        setWedding(weddingRes.data);
        setPlans(plansRes.data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load video plan data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Generate a video plan for the selected function
  const handleGenerate = async () => {
    if (!selectedFunction) {
      setError('Please select a function first');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      const response = await generateFunctionVideoPlan(id, selectedFunction);
      setGeneratedResult(response.data);

      // Refresh the plans list
      const plansRes = await getWeddingVideoPlans(id);
      setPlans(plansRes.data);
    } catch (err) {
      setError(err.message || 'Failed to generate video plan');
      setGeneratedResult(null);
    } finally {
      setGenerating(false);
    }
  };

  // Display a plan's output (for viewing saved plans)
  const viewPlan = (plan) => {
    setGeneratedResult(plan);
  };

  // Show the confirmation dialog for a plan the user wants to delete
  const askDelete = (plan) => {
    setPlanToDelete(plan);
  };

  // Delete the chosen plan after the user confirms
  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      setDeleting(true);
      setError('');
      await deleteVideoPlan(planToDelete._id);

      // Remove the deleted plan from the list (filter keeps everything except it)
      setPlans(plans.filter((p) => p._id !== planToDelete._id));

      // If the plan that was being viewed got deleted, clear the result panel
      if (generatedResult && generatedResult._id === planToDelete._id) {
        setGeneratedResult(null);
      }

      setPlanToDelete(null);
    } catch (err) {
      setError(err.message || 'Unable to delete video plan. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading video planning..." />;
  }

  if (!wedding) {
    return (
      <div className="error-page">
        <h2>Wedding not found</h2>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  // Helper to render a shot list with bullets
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

  return (
    <div className="video-plan-page">
      <div className="page-header">
        <div>
          <Link to={`/wedding/${id}`} className="back-link">&larr; Back to Wedding</Link>
          <h1>Function Video Plans</h1>
          <p className="page-subtitle">{wedding.coupleName}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Generation Form Section */}
      <div className="generator-card">
        <h2>Generate Function Video Plan</h2>
        <p className="form-hint">
          Select a wedding function and our AI will create a detailed video planning guide
        </p>

        {wedding.functions && wedding.functions.length > 0 ? (
          <div className="generator-content">
            <div className="form-group">
              <label htmlFor="functionSelect">Select Function</label>
              <select
                id="functionSelect"
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
              >
                <option value="">-- Select a function --</option>
                {wedding.functions.map((func) => (
                  <option key={func._id} value={func._id}>
                    {func.functionName} · {func.date ? new Date(func.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating
                ? 'Generating Plan...'
                : selectedFunction
                  ? 'Generate Video Plan'
                  : 'Select a Function First'}
            </Button>
          </div>
        ) : (
          <div className="empty-state">
            <p>No functions added yet.</p>
            <Link to={`/wedding/${id}`} className="btn btn-primary">
              Add Functions First
            </Link>
          </div>
        )}
      </div>

      {/* Generated Result Display */}
      {generatedResult && generatedResult.aiOutput && (
        <div className="result-section">
          <div className="result-header">
            <h2>Plan Result</h2>
            <span className="result-badge">{generatedResult.aiOutput.functionName}</span>
          </div>

          <div className="result-cards">
            {/* Duration and Mood */}
            <div className="result-card">
              <h3>Recommended Duration</h3>
              <p>{generatedResult.aiOutput.recommendedDuration}</p>
            </div>
            <div className="result-card">
              <h3>Mood</h3>
              <p>{generatedResult.aiOutput.mood}</p>
            </div>

            {/* Important Moments */}
            {generatedResult.aiOutput.importantMoments?.length > 0 && (
              <div className="result-card">
                <h3>Important Moments</h3>
                {renderList(generatedResult.aiOutput.importantMoments)}
              </div>
            )}

            {/* Must Capture Shots */}
            {generatedResult.aiOutput.mustCaptureShots?.length > 0 && (
              <div className="result-card">
                <h3>Must Capture Shots</h3>
                {renderList(generatedResult.aiOutput.mustCaptureShots)}
              </div>
            )}

            {/* Cinematic Shots */}
            {generatedResult.aiOutput.cinematicShots?.length > 0 && (
              <div className="result-card">
                <h3>Cinematic Shots</h3>
                {renderList(generatedResult.aiOutput.cinematicShots)}
              </div>
            )}

            {/* Candid Moments */}
            {generatedResult.aiOutput.candidMoments?.length > 0 && (
              <div className="result-card">
                <h3>Candid Moments</h3>
                {renderList(generatedResult.aiOutput.candidMoments)}
              </div>
            )}

            {/* Family Moments */}
            {generatedResult.aiOutput.familyMoments?.length > 0 && (
              <div className="result-card">
                <h3>Family Moments</h3>
                {renderList(generatedResult.aiOutput.familyMoments)}
              </div>
            )}

            {/* Couple Moments */}
            {generatedResult.aiOutput.coupleMoments?.length > 0 && (
              <div className="result-card">
                <h3>Couple Moments</h3>
                {renderList(generatedResult.aiOutput.coupleMoments)}
              </div>
            )}

            {/* Decor Shots */}
            {generatedResult.aiOutput.decorShots?.length > 0 && (
              <div className="result-card">
                <h3>Decoration Shots</h3>
                {renderList(generatedResult.aiOutput.decorShots)}
              </div>
            )}

            {/* Entry/Exit Shots */}
            {generatedResult.aiOutput.entryExitShots?.length > 0 && (
              <div className="result-card">
                <h3>Entry & Exit Shots</h3>
                {renderList(generatedResult.aiOutput.entryExitShots)}
              </div>
            )}

            {/* Music Style */}
            {generatedResult.aiOutput.suggestedMusicStyle && (
              <div className="result-card">
                <h3>Suggested Music Style</h3>
                <p>{generatedResult.aiOutput.suggestedMusicStyle}</p>
              </div>
            )}

            {/* Transition Suggestions */}
            {generatedResult.aiOutput.transitionSuggestions?.length > 0 && (
              <div className="result-card">
                <h3>Transition Suggestions</h3>
                {renderList(generatedResult.aiOutput.transitionSuggestions)}
              </div>
            )}

            {/* Editing Notes */}
            {generatedResult.aiOutput.editingNotes?.length > 0 && (
              <div className="result-card">
                <h3>Editing Notes</h3>
                {renderList(generatedResult.aiOutput.editingNotes)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Plans List */}
      {plans.length > 0 && (
        <div className="saved-plans-section">
          <h2>Saved Video Plans ({plans.length})</h2>
          <div className="saved-plans-grid">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="saved-plan-card"
                onClick={() => viewPlan(plan)}
              >
                <div className="saved-plan-title">
                  {plan.aiOutput?.functionName || `${plan.planType}`}
                </div>
                <div className="saved-plan-meta">
                  {plan.planType === 'function-video' ? 'Function Plan' : 'Highlight Plan'}
                  {plan.planType === 'function-video' && plan.function &&
                    ` · ${plan.function.functionName || ''}`}
                </div>
                <div className="saved-plan-date">
                  {new Date(plan.createdAt).toLocaleDateString('en-IN', {
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
                      e.stopPropagation(); // don't open the plan, only delete
                      askDelete(plan);
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
        open={!!planToDelete}
        title="Delete Video Plan"
        message="Are you sure you want to delete this saved video plan? This action cannot be undone."
        onCancel={() => setPlanToDelete(null)}
        onConfirm={handleDelete}
        confirming={deleting}
      />
    </div>
  );
};

export default VideoPlan;