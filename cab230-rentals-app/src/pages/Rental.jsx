// Import
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL as API, authHeaders, authJsonHeaders } from "../api";

// Star rating component
function StarDisplay({ rating }) {
  return (
    <span className="stars">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

// Rating component
function RatingWidget({ rentalId }) {
  // Design
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [existing, setExisting] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Auth from local storage
  const token = localStorage.getItem("token");

  // Load existing user rating
  useEffect(() => {
    // Stop if user not logged in
    if (!token) return;
    // Get rating from API
    fetch(`${API}/ratings/rentals/${rentalId}`, {
      headers: authHeaders(),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setExisting(d);
          setSelected(d.rating);
        }
      })
      .catch(() => {});
  }, [rentalId, token]);

  // Ask user to sign in if not
  if (!token)
    return (
      <div className="rating-widget">
        <p>
          <Link to="/login" style={{ color: "var(--brand)", fontWeight: 500 }}>
            Sign in
          </Link>{" "}
          to rate this property.
        </p>
      </div>
    );

  // Submit new rating to API
  const submit = () => {
    if (!selected) return;
    setLoading(true);
    setStatus("");
    // POST request to submit
    fetch(`${API}/ratings/rentals/${rentalId}`, {
      method: "POST",
      headers: authJsonHeaders(),
      body: JSON.stringify({ rating: selected }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setExisting(d);
        setStatus("Rating saved!");
      })
      .catch(() => setStatus("Something went wrong."))
      .finally(() => setLoading(false));
  };

  // New rating updated page
  return (
    <div className="rating-widget">
      <p>
        {existing
          ? `Your rating: updated ${new Date(existing.dateTime).toLocaleDateString()}`
          : "Rate this property"}
      </p>
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(n)}
            style={{
              color: n <= (hovered || selected) ? "#f59e0b" : "#d1d5db",
            }}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={submit}
        disabled={!selected || loading}
      >
        {loading ? "Saving…" : existing ? "Update rating" : "Submit rating"}
      </button>
      {status && (
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.8rem",
            color: status.includes("!") ? "#166534" : "#c0152d",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

// Main rentals page
export default function Rental() {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/rentals/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setRental)
      .catch(() => setError("Property not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading property…</div>;
  if (error)
    return (
      <div className="empty-state">
        <strong>{error}</strong>
      </div>
    );
  if (!rental) return null;

  const amenityList = rental.amenities
    ? rental.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    : [];

  // UI Components
  return (
    <div>
      <Link to="/search" className="rental-back">
        ← Back to search
      </Link>

      <div className="rental-hero">
        <div>
          <h1>{rental.title}</h1>
          <div className="rental-hero-sub">
            {rental.streetAddress}, {rental.suburb} {rental.postcode},{" "}
            {rental.state}
          </div>
          {rental.numRatings > 0 && (
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "#f59e0b" }}>
                {"★".repeat(Math.round(rental.averageRating))}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {rental.averageRating.toFixed(1)} from {rental.numRatings}{" "}
                review{rental.numRatings !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <div className="rental-price">
          ${rental.rent}
          <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>/wk</span>
        </div>
      </div>

      <div className="rental-grid">
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="card-panel">
            <h3>Description</h3>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: rental.description }}
            />
          </div>
          {amenityList.length > 0 && (
            <div className="card-panel">
              <h3>Amenities</h3>
              <div className="amenity-tags">
                {amenityList.map((a, i) => (
                  <span key={i} className="amenity-tag">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="card-panel">
            <h3>Property details</h3>
            <div className="detail-row">
              <span className="label">Type</span>
              <span className="val" style={{ textTransform: "capitalize" }}>
                {rental.propertyType}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Bedrooms</span>
              <span className="val">{rental.bedrooms}</span>
            </div>
            <div className="detail-row">
              <span className="label">Bathrooms</span>
              <span className="val">{rental.bathrooms}</span>
            </div>
            <div className="detail-row">
              <span className="label">Parking</span>
              <span className="val">{rental.parkingSpaces}</span>
            </div>
            <div className="detail-row">
              <span className="label">Agency</span>
              <span
                className="val"
                style={{
                  textAlign: "right",
                  maxWidth: "55%",
                  fontSize: "0.8rem",
                }}
              >
                {rental.agencyName}
              </span>
            </div>

            <RatingWidget rentalId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
