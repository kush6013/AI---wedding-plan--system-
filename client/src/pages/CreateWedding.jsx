// CreateWedding.jsx - Form to create a new wedding
// Has two sections: client/wedding info form and function builder
// Users can add multiple functions (Haldi, Mehendi, Sangeet, etc.)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWedding, createFunction } from '../services/api';
import Button from '../components/Button';

const CreateWedding = () => {
  const navigate = useNavigate();

  // Wedding form data state
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    coupleName: '',
    weddingDate: '',
    weddingLocation: '',
    weddingCity: '',
    weddingDescription: '',
    weddingTheme: 'Traditional Indian',
    guestCount: '',
  });

  // Functions list - users can add multiple functions
  const [functions, setFunctions] = useState([]);

  // Current function being added (temporary form)
  const [currentFunction, setCurrentFunction] = useState({
    functionName: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    description: '',
    importance: 'medium',
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Step 1: Wedding info, Step 2: Functions

  // Handle wedding form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle function form input changes
  const handleFunctionChange = (e) => {
    const { name, value } = e.target;
    setCurrentFunction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add current function to the functions list
  const handleAddFunction = (e) => {
    e.preventDefault();

    if (!currentFunction.functionName || !currentFunction.date) {
      setError('Function name and date are required');
      return;
    }

    setFunctions((prev) => [...prev, { ...currentFunction }]);

    // Reset current function form
    setCurrentFunction({
      functionName: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      description: '',
      importance: 'medium',
    });
    setError('');
  };

  // Remove a function from the list
  const handleRemoveFunction = (index) => {
    setFunctions((prev) => prev.filter((_, i) => i !== index));
  };

  // Quick-add predefined function names
  const quickAddFunction = (name) => {
    setCurrentFunction((prev) => ({
      ...prev,
      functionName: name,
    }));
  };

  // Submit the entire wedding with functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required wedding fields
      if (!formData.clientName || !formData.email || !formData.coupleName ||
          !formData.weddingDate || !formData.weddingLocation) {
        setError('Please fill in all required wedding fields');
        setLoading(false);
        return;
      }

      // Step 1: Create the wedding
      const weddingResponse = await createWedding({
        ...formData,
        guestCount: formData.guestCount ? Number(formData.guestCount) : 0,
      });

      const weddingId = weddingResponse.data._id;

      // Step 2: Create each function and link it to the wedding
      for (const func of functions) {
        await createFunction({
          wedding: weddingId,
          ...func,
        });
      }

      // Navigate to the wedding details page
      navigate(`/wedding/${weddingId}`);
    } catch (err) {
      setError(err.message || 'Failed to create wedding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-wedding-page">
      <div className="page-header">
        <h1>Create New Wedding</h1>
        <p>Fill in the wedding details and add functions</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Wedding Details</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Wedding Functions</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Wedding Details Form */}
        {step === 1 && (
          <div className="form-section">
            <h2>Client Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="clientName">Client Name *</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="client@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <h2>Wedding Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="coupleName">Couple Name *</label>
                <input
                  type="text"
                  id="coupleName"
                  name="coupleName"
                  value={formData.coupleName}
                  onChange={handleInputChange}
                  placeholder="e.g., Rahul & Priya"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weddingDate">Wedding Date *</label>
                <input
                  type="date"
                  id="weddingDate"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weddingLocation">Venue / Location *</label>
                <input
                  type="text"
                  id="weddingLocation"
                  name="weddingLocation"
                  value={formData.weddingLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., The Grand Palace"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weddingCity">City</label>
                <input
                  type="text"
                  id="weddingCity"
                  name="weddingCity"
                  value={formData.weddingCity}
                  onChange={handleInputChange}
                  placeholder="e.g., Jaipur"
                />
              </div>
              <div className="form-group">
                <label htmlFor="weddingTheme">Theme</label>
                <select
                  id="weddingTheme"
                  name="weddingTheme"
                  value={formData.weddingTheme}
                  onChange={handleInputChange}
                >
                  <option value="Traditional Indian">Traditional Indian</option>
                  <option value="Royal Rajasthani">Royal Rajasthani</option>
                  <option value="Modern Minimalist">Modern Minimalist</option>
                  <option value="Garden Party">Garden Party</option>
                  <option value="Beach Wedding">Beach Wedding</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Fusion">Fusion</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Punjabi">Punjabi</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="guestCount">Expected Guests</label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  min="0"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="weddingDescription">Description</label>
              <textarea
                id="weddingDescription"
                name="weddingDescription"
                value={formData.weddingDescription}
                onChange={handleInputChange}
                placeholder="Tell us about the wedding vision..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <Button variant="primary" onClick={() => {
                if (!formData.clientName || !formData.email || !formData.coupleName ||
                    !formData.weddingDate || !formData.weddingLocation) {
                  setError('Please fill in all required fields before proceeding');
                  return;
                }
                setError('');
                setStep(2);
              }}>
                Next: Add Functions
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Add Functions */}
        {step === 2 && (
          <div className="form-section">
            <div className="section-with-back">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setStep(1)}
              >
                &larr; Back to Wedding Details
              </button>
            </div>

            <h2>Wedding Functions</h2>
            <p className="form-hint">
              Add the wedding functions (Haldi, Mehendi, Sangeet, etc.)
            </p>

            {/* Quick-add buttons for common functions */}
            <div className="quick-add-functions">
              <span className="quick-add-label">Quick add:</span>
              {['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception'].map((name) => (
                <button
                  key={name}
                  type="button"
                  className="quick-add-btn"
                  onClick={() => quickAddFunction(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Add Function Form */}
            <div className="add-function-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="functionName">Function Name *</label>
                  <input
                    type="text"
                    id="functionName"
                    name="functionName"
                    value={currentFunction.functionName}
                    onChange={handleFunctionChange}
                    placeholder="e.g., Haldi"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="funcDate">Date *</label>
                  <input
                    type="date"
                    id="funcDate"
                    name="date"
                    value={currentFunction.date}
                    onChange={handleFunctionChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={currentFunction.startTime}
                    onChange={handleFunctionChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={currentFunction.endTime}
                    onChange={handleFunctionChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="venue">Venue</label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={currentFunction.venue}
                    onChange={handleFunctionChange}
                    placeholder="Function venue"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="importance">Importance</label>
                  <select
                    id="importance"
                    name="importance"
                    value={currentFunction.importance}
                    onChange={handleFunctionChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="funcDescription">Description</label>
                <textarea
                  id="funcDescription"
                  name="description"
                  value={currentFunction.description}
                  onChange={handleFunctionChange}
                  placeholder="Describe this function..."
                  rows="2"
                />
              </div>
              <Button variant="secondary" onClick={handleAddFunction}>
                + Add Function
              </Button>
            </div>

            {/* List of added functions */}
            {functions.length > 0 && (
              <div className="added-functions-list">
                <h3>Added Functions ({functions.length})</h3>
                <div className="functions-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Venue</th>
                        <th>Importance</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {functions.map((func, index) => (
                        <tr key={index}>
                          <td>{func.functionName}</td>
                          <td>{func.date || '-'}</td>
                          <td>
                            {func.startTime && func.endTime
                              ? `${func.startTime} - ${func.endTime}`
                              : func.startTime || '-'}
                          </td>
                          <td>{func.venue || '-'}</td>
                          <td>
                            <span className={`importance-badge importance-${func.importance}`}>
                              {func.importance}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveFunction(index)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit buttons */}
            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Creating Wedding...' : 'Create Wedding'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateWedding;
