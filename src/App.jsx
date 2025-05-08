import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Loader
import Loader from "./components/loader/Loader";
// Layout
import DefaultLayout from "./components/layouts/Default-layout";
// Pages
import Login from "./components/pages/Login";
import NotFoundPage from "./NotFoundPage";
// ./Dashboard/...
import HotelAnalyticsDashboard from "./components/pages/dashboard/Hotel-analytics";
// Page lain 
import Hotels from "./components/pages/Hotels/Hotels";
import Revenues from "./components/pages/Revenues/Revenues";
import Reviews from "./components/pages/Reviews n Sentiments/Reviews";
import Scrapes from "./components/pages/Scraping/Scrapes";
import Settings from "./components/pages/Settings";
// Private Route
import PrivateRoute from "./PrivateRoute";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<DefaultLayout />}>
            <Route
              path="/analytics"
              element={<PrivateRoute element={<HotelAnalyticsDashboard />} />}
            />
            <Route
              path="/hotels"
              element={<PrivateRoute element={<Hotels />} />}
            />
            <Route
              path="/revenues"
              element={<PrivateRoute element={<Revenues />} />}
            />
            <Route
              path="/reviews"
              element={<PrivateRoute element={<Reviews />} />}
            />
            <Route
              path="/scraping"
              element={<PrivateRoute element={<Scrapes />} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<Settings />} />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;