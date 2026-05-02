// Imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL as API, authHeaders } from "../api";

// Star rating display
function StarDisplay({ n }) {
  return (
    <span className="stars">
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </span>
  );
}

// Main ratings page
export default function RatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Auth from local storage
  const token = localStorage.getItem("token");

  // Load ratings from API
  const load = (pg = 1) => {
    setLoading(true);
    setPage(pg);
    // Get from API
    fetch(`${API}/ratings?page=${pg}`, {
      headers: authHeaders(),
    })
      // Handle failures
      .then((r) => {
        if (r.status === 401) throw new Error("auth");
        if (!r.ok) throw new Error("Failed to load ratings.");
        return r.json();
      })
      .then((d) => {
        setRatings(d.data || []);
        setPagination(d.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Load ratings
  useEffect(() => {
    if (token) load(1);
    else setLoading(false);
  }, []);

  // Ensure user logged in
  if (!token) {
    return (
      <div className="auth-guard">
        <h2>Sign in to view your ratings</h2>
        <p>You need to be logged in to see the properties you've rated.</p>
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  // UI Components
  return (
    <div>
      <div className="page-header">
        <h1>My ratings</h1>
        <p>Properties you've reviewed</p>
      </div>

      {loading && <div className="loading">Loading ratings…</div>}
      {error && <div className="form-error">{error}</div>}

      {!loading && !error && ratings.length === 0 && (
        <div className="empty-state">
          <strong>No ratings yet</strong>
          <p>Browse properties and leave a star rating to see them here.</p>
          <Link
            to="/"
            style={{ marginTop: "1rem", display: "inline-block" }}
            className="btn btn-primary"
          >
            Browse properties
          </Link>
        </div>
      )}

      {!loading && ratings.length > 0 && (
        <>
          <div className="ratings-list">
            {ratings.map((r) => (
              <Link
                to={`/rental/${r.rentalId}`}
                key={r.rentalId + r.dateTime}
                className="rating-item"
              >
                <div className="rating-item-left">
                  <strong>Property #{r.rentalId}</strong>
                  <span>
                    Rated{" "}
                    {new Date(r.dateTime).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="rating-item-right">
                  <StarDisplay n={r.rating} />
                  <span>{r.rating}/5</span>
                </div>
              </Link>
            ))}
          </div>

          {pagination && pagination.lastPage > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={!pagination.prevPage}
                onClick={() => load(page - 1)}
              >
                ← Prev
              </button>
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                className="page-btn"
                disabled={!pagination.nextPage}
                onClick={() => load(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
