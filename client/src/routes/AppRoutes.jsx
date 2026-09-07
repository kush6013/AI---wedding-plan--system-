// AppRoutes - defines all page routes for the application
// Each route maps a URL path to a page component

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import CreateWedding from '../pages/CreateWedding';
import WeddingDetails from '../pages/WeddingDetails';
import VideoPlan from '../pages/VideoPlan';
import HighlightVideo from '../pages/HighlightVideo';
import AlbumDesign from '../pages/AlbumDesign';

const AppRoutes = () => {
  return (
    <Router>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Routes define which page shows for each URL */}
      <div className="page-content">
        <Routes>
          {/* Landing page at root URL */}
          <Route path="/" element={<Home />} />

          {/* Dashboard showing all weddings */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Form to create a new wedding */}
          <Route path="/create-wedding" element={<CreateWedding />} />

          {/* Wedding details page with functions and AI generation */}
          <Route path="/wedding/:id" element={<WeddingDetails />} />

          {/* Function video plan generation and results */}
          <Route path="/wedding/:id/video-plan" element={<VideoPlan />} />

          {/* Overall highlight video plan */}
          <Route path="/wedding/:id/highlight" element={<HighlightVideo />} />

          {/* Album design generation and results */}
          <Route path="/wedding/:id/album" element={<AlbumDesign />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
