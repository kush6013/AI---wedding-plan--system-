// HighlightVideo.jsx - Overall wedding highlight video planning page
// Generates a complete highlight video structure using AI

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getWeddingById,
  getWeddingVideoPlans,
  generateHighlightVideoPlan,
} from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';

const HighlightVideo = () => {
  const { id } = useParams(); // wedding ID from URL

  const [wedding, setWedding] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Fetch wedding details and existing highlight plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weddingRes, plansRes] = await Promise.all([
          getWeddingById(id),
          getWeddingVideoPlans(id),
        ]);
        setWedding(weddingRes.data);

        // Filter plans to show only highlight-video type
        const highlightPlans = plansRes.data.filter(
          (plan) => plan.planType === 'highlight-video'
        );
        setPlans(highlightPlans);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load highlight plan data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Generate the highlight video plan
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await generateHighlightVideoPlan(id);
      setResult(response.data);

      // Refresh the plans list
      const plansRes = await getWeddingVideoPlans(id);
      setPlans(plansRes.data.filter((plan) => plan.planType === 'highlight-video'));
    } catch (err) {
      setError(err.message || 'Failed to generate highlight plan');
      setResult(null);
    } finally {
      setGenerating(false);
    }
  };

  const viewPlan = (plan) => {
    setResult(plan);
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
    return <Loading message="Loading highlight video planning..." />;
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
    <div className="highlight-page">
      <div className="page-header">
        <div>
          <Link to={`/wedding/${id}`} className="back-link">&larr; Back to Wedding</Link>
          <h1>Overall Highlight Video Plan</h1>
          <p className="page-subtitle">{wedding.coupleName}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Generation Section */}
      <div className="generator-card">
        <h2>Generate Wedding Highlight Video Structure</h2>
        <p className="form-hint">
          Our AI will create a complete highlight video structure based on your wedding details and functions
        </p>
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? 'Generating Highlight Plan...' : 'Generate Highlight Video Plan'}
        </Button>
      </div>

      {/* Result Display */}
      {result && result.aiOutput && (
        <div className="result-section">
          <div className="result-header">
            <h2>Highlight Video Plan</h2>
            <span className="result-badge">Saved</span>
          </div>

          {/* Total Duration */}
          {result.aiOutput.totalRecommendedDuration && (
            <div className="result-card highlight-summary">
              <h3>Total Recommended Duration</h3>
              <p>{result.aiOutput.totalRecommendedDuration}</p>
            </div>
          )}

          {/* Opening Sequence */}
          {result.aiOutput.openingSequence && (
            <div className="result-card highlight-section-card">
              <div className="section-number">01</div>
              <div className="section-content">
                <h3>{result.aiOutput.openingSequence.title || 'Opening Sequence'}</h3>
                <p className="section-duration">
                  Duration: {result.aiOutput.openingSequence.duration || 'Not specified'}
                </p>
                <p>{result.aiOutput.openingSequence.description}</p>
                {renderList(result.aiOutput.openingSequence.shots)}
                {result.aiOutput.openingSequence.musicMood && (
                  <div className="music-tag">
                    Music: {result.aiOutput.openingSequence.musicMood}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Sections */}
          {result.aiOutput.sections && result.aiOutput.sections.length > 0 && (
            <>
              <h3 className="sections-title">Video Sections</h3>
              {result.aiOutput.sections.map((section, index) => (
                <div key={index} className="result-card highlight-section-card">
                  <div className="section-number">{String(index + 2).padStart(2, '0')}</div>
                  <div className="section-content">
                    <h3>{section.title}</h3>
                    <p className="section-duration">
                      Duration: {section.duration || 'Not specified'}
                    </p>
                    {section.description && <p>{section.description}</p>}
                    {renderList(section.shots)}
                    {section.transitions && (
                      <div className="music-tag">
                        Transitions: {section.transitions}
                      </div>
                    )}
                    {section.musicMood && (
                      <div className="music-tag">
                        Music: {section.musicMood}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Emotional Climax */}
          {result.aiOutput.emotionalClimax && (
            <div className="result-card highlight-section-card climax">
              <div className="section-number">&#10084;</div>
              <div className="section-content">
                <h3>{result.aiOutput.emotionalClimax.title || 'Emotional Climax'}</h3>
                <p className="section-duration">
                  Duration: {result.aiOutput.emotionalClimax.duration || 'Not specified'}
                </p>
                <p>{result.aiOutput.emotionalClimax.description}</p>
                {renderList(result.aiOutput.emotionalClimax.shots)}
                {result.aiOutput.emotionalClimax.musicMood && (
                  <div className="music-tag">
                    Music: {result.aiOutput.emotionalClimax.musicMood}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ending Sequence */}
          {result.aiOutput.endingSequence && (
            <div className="result-card highlight-section-card">
              <div className="section-number">END</div>
              <div className="section-content">
                <h3>{result.aiOutput.endingSequence.title || 'Ending Sequence'}</h3>
                <p className="section-duration">
                  Duration: {result.aiOutput.endingSequence.duration || 'Not specified'}
                </p>
                <p>{result.aiOutput.endingSequence.description}</p>
                {renderList(result.aiOutput.endingSequence.shots)}
                {result.aiOutput.endingSequence.musicMood && (
                  <div className="music-tag">
                    Music: {result.aiOutput.endingSequence.musicMood}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Overall Direction */}
          <div className="result-cards">
            {result.aiOutput.overallMusicDirection && (
              <div className="result-card">
                <h3>Overall Music Direction</h3>
                <p>{result.aiOutput.overallMusicDirection}</p>
              </div>
            )}
            {result.aiOutput.colorGradingSuggestion && (
              <div className="result-card">
                <h3>Color Grading</h3>
                <p>{result.aiOutput.colorGradingSuggestion}</p>
              </div>
            )}
            {result.aiOutput.editingStyle && (
              <div className="result-card">
                <h3>Editing Style</h3>
                <p>{result.aiOutput.editingStyle}</p>
              </div>
            )}
          </div>

          {/* Key Transitions */}
          {result.aiOutput.keyTransitions && result.aiOutput.keyTransitions.length > 0 && (
            <div className="result-card">
              <h3>Key Transition Points</h3>
              {renderList(result.aiOutput.keyTransitions)}
            </div>
          )}
        </div>
      )}

      {/* Saved Plans */}
      {plans.length > 0 && (
        <div className="saved-plans-section">
          <h2>Saved Highlight Plans ({plans.length})</h2>
          <div className="saved-plans-grid">
            {plans.map((plan) => (
              <button
                key={plan._id}
                className="saved-plan-card"
                onClick={() => viewPlan(plan)}
              >
                <div className="saved-plan-title">
                  {plan.aiOutput?.coupleName || 'Wedding Highlight Plan'}
                </div>
                <div className="saved-plan-meta">
                  Total Duration: {plan.aiOutput?.totalRecommendedDuration || 'N/A'}
                </div>
                <div className="saved-plan-date">
                  {new Date(plan.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <span className="view-now">Click to view</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightVideo;