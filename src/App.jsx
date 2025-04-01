import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Loader
import Loader from "./components/loader/Loader"

// Pages
import NotFoundPage from "./NotFoundPage"
import Login from "./components/pages/Login"

//Layout
import DefaultLayout from "./components/layouts/DefaultLayout";

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
            <Route  path="/" element={<h1>Dashboard</h1>} />
           </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;

