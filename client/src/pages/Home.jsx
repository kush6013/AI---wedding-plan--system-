// Home.jsx - Landing page for the AI Wedding Planning System
// This is the first page visitors see
// It explains what the system does and how to get started

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section - Main banner with call to action */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">AI-Powered Wedding Planning</span>
          <h1 className="hero-title">
            Plan Your Perfect Wedding with
            <span className="highlight"> Artificial Intelligence</span>
          </h1>
          <p className="hero-description">
            Create function-wise video plans, wedding highlight structures,
            and album design concepts using AI. Get professional-grade output
            that editors, photographers, and designers can use directly.
          </p>
          <div className="hero-actions">
            <Link to="/create-wedding" className="btn btn-primary btn-lg">
              Start Planning
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* What the system does */}
      <section className="features-section">
        <div className="section-header">
          <h2>What Our AI Can Do</h2>
          <p>Three powerful AI tools to plan your wedding visuals</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">&#127909;</div>
            <h3>Function Video Planning</h3>
            <p>
              Get detailed shot lists, music suggestions, and editing notes
              for each wedding function - Haldi, Mehendi, Sangeet,
              Wedding, and Reception.
            </p>
            <ul className="feature-list">
              <li>Must-capture shots</li>
              <li>Cinematic suggestions</li>
              <li>Music style recommendations</li>
              <li>Editing notes for video editors</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">&#127916;</div>
            <h3>Highlight Video Structure</h3>
            <p>
              Generate a complete highlight video plan with sections,
              timing, transitions, and emotional flow from start to finish.
            </p>
            <ul className="feature-list">
              <li>Opening and closing sequences</li>
              <li>Section-by-section breakdown</li>
              <li>Duration recommendations</li>
              <li>Music and transition direction</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">&#128247;</div>
            <h3>Album Design System</h3>
            <p>
              Get AI-assisted album themes, page layouts, color palettes,
              and photo arrangement ideas for a beautiful wedding album.
            </p>
            <ul className="feature-list">
              <li>Album theme and color palette</li>
              <li>Page-by-page structure</li>
              <li>Layout suggestions</li>
              <li>Photo selection advice</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four simple steps to plan your wedding visuals</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Wedding</h3>
            <p>Enter your wedding details, couple information, and add all wedding functions.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Generate Plans</h3>
            <p>Click generate and our AI creates detailed video and album plans for you.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Review Results</h3>
            <p>View the AI-generated plans, organized by function with all the details.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Share & Execute</h3>
            <p>Share the plans with your editors, photographers, and design team.</p>
          </div>
        </div>
      </section>

      {/* Role Overview */}
      <section className="roles-section">
        <div className="section-header">
          <h2>Who Is This For?</h2>
          <p>Built for everyone involved in wedding planning</p>
        </div>

        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon">&#128100;</div>
            <h3>Admin</h3>
            <p>View all weddings, clients, and generated plans. Manage the application data from a central dashboard.</p>
          </div>
          <div className="role-card">
            <div className="role-icon">&#128141;</div>
            <h3>Client</h3>
            <p>Create your wedding, add functions, generate AI video plans and album designs for your special day.</p>
          </div>
          <div className="role-card">
            <div className="role-icon">&#127909;</div>
            <h3>Editor / Videographer</h3>
            <p>View detailed video plans, shot lists, and editing notes. Use AI-generated output as your editing guide.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Plan Your Wedding?</h2>
        <p>Get started with AI-powered wedding planning in minutes</p>
        <Link to="/create-wedding" className="btn btn-primary btn-lg">
          Create Your Wedding Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
