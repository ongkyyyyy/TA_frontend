import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Loader
import Loader from "./components/loader/Loader"

// Layout
import DefaultLayout from "./components/layouts/DefaultLayout";

// Pages
import Login from "./components/pages/Login"
import NotFoundPage from "./NotFoundPage"
// Dashboard
import Analytics from "./components/pages/dashboard/Analytics";
import Reporting from "./components/pages/dashboard/Reporting";
// Other menus
import Revenues from "./components/pages/Revenues";
import Reviews from "./components/pages/Reviews";
import Sentiments from "./components/pages/Sentiments";
import Settings from "./components/pages/Settings";

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
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />
           <Route element={<DefaultLayout />}>
            <Route  path="/" element={<Analytics/>} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/revenues" element={<Revenues />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/sentiments" element={<Sentiments />} />
            <Route path="/settings" element={<Settings />} />
           </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;

