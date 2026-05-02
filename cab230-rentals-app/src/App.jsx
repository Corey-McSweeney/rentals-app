// Import Routing
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

// React Hooks
import { useState, useEffect } from "react";

// Import main functions from other files
import Home from "./pages/Home";
import Search from "./pages/Search";
import Rental from "./pages/Rental";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ratings from "./pages/Ratings";

// CSS
import "./App.css";

// Create navbar for all pages
function Nav() {
  // Hppl fpr navigation to pages
  const navigate = useNavigate();

  // Check if auth token stored locally
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  // Auth check
  useEffect(() => {
    const check = () => setLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("auth", check);
    return () => window.removeEventListener("auth", check);
  }, []);

  // Create a logout function
  const logout = () => {
    // Remove auth token locally
    localStorage.removeItem("token");

    // Update login state
    setLoggedIn(false);

    // Notify of auth change
    window.dispatchEvent(new Event("auth"));
    navigate("/");
  };

  // Return navigation bar UI component
  return (
    <nav className="nav">
      {/* Site name or brand */}
      <NavLink to="/" className="nav-brand">
        rentr.
      </NavLink>

      <div className="nav-links">
        {loggedIn ? (
          <>
            <NavLink
              to="/ratings"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My Ratings
            </NavLink>
            <button onClick={logout} className="nav-btn-ghost">
              Sign out
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Sign in
            </NavLink>
            <NavLink to="/register" className="nav-btn">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

// Main App component
export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/rental/:id" element={<Rental />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ratings" element={<Ratings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
