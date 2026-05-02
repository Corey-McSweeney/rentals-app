// Imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL as API } from "../api";

// Create star rating component
function StarDisplay({ rating }) {
  // Get full number
  const full = Math.floor(rating);
  // Check for half stars
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return "★";
        if (i === full && half) return "⭑";
        return "☆";
      }).join("")}
    </span>
  );
}

// Create card for showcasing properties
function PropertyCard({ p }) {
  return (
    // Link to rental details using ID
    <Link to={`/rental/${p.id}`} className="property-card">
      {/* Card image or thumbnail area */}
      <div className="card-thumb">
        {/* Display first two letters of suburb as label */}
        <span className="card-thumb-label">
          {p.suburb?.slice(0, 2).toUpperCase()}
        </span>
        {/* Property type */}
        <span className="card-badge">{p.propertyType}</span>
        {/* Rent */}
        <span className="card-rent">${p.rent}/wk</span>
      </div>
      {/* Main card component */}
      <div className="card-body">
        <div className="card-title">{p.title}</div>
        <div className="card-location">
          {p.suburb}, {p.state} {p.postcode}
        </div>
        <div className="card-meta">
            {/* Use symbols for property characteristics */}
          <span>🛏 {p.bedrooms}</span>
          <span>🚿 {p.bathrooms}</span>
          <span>🚗 {p.parkingSpaces}</span>
        </div>
        {p.numRatings > 0 && (
          <div className="card-rating">
            <StarDisplay rating={p.averageRating} />
            <span>
              {p.averageRating.toFixed(1)} ({p.numRatings})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// Main search compoennt
export default function Search() {
    // Store results
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [states, setStates] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [filters, setFilters] = useState({
    suburb: "",
    state: "",
    postcode: "",
    propertyType: "",
    minimumBedrooms: "",
    maximumBedrooms: "",
    minimumRent: "",
    maximumRent: "",
    sortBy: "id",
    sortOrder: "asc",
  });

  // Helper function updates filter values
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  // Get options off API for filtering properties
  useEffect(() => {
    fetch(`${API}/rentals/states`)
      .then((r) => r.json())
      .then(setStates)
      .catch(() => {});

    fetch(`${API}/rentals/property-types`)
      .then((r) => r.json())
      .then(setPropertyTypes)
      .catch(() => {});
  }, []);

  // Buid query parameters for API search
  const buildParams = (pg = 1) => {
    const p = new URLSearchParams();
    if (filters.suburb) p.set("suburb", filters.suburb);
    if (filters.state) p.set("state", filters.state);
    if (filters.postcode) p.set("postcode", filters.postcode);
    if (filters.propertyType) p.append("propertyTypes", filters.propertyType);
    if (filters.minimumBedrooms)
      p.set("minimumBedrooms", filters.minimumBedrooms);
    if (filters.maximumBedrooms)
      p.set("maximumBedrooms", filters.maximumBedrooms);
    if (filters.minimumRent) p.set("minimumRent", filters.minimumRent);
    if (filters.maximumRent) p.set("maximumRent", filters.maximumRent);
    
    // Sorting options
    if (filters.sortBy) p.set("sortBy", filters.sortBy);
    if (filters.sortBy && filters.sortOrder)
      p.set("sortOrder", filters.sortOrder);
    p.set("page", pg);
    return p.toString();
  };

  // Search Function to send request to API and update results
  const search = (pg = 1) => 
    setLoading(true);

    // Update current page
    setPage(pg);

    // Get API search results
    fetch(`${API}/rentals/search?${buildParams(pg)}`)
      .then((r) => r.json())
      .then((d) => {
        setResults(d.data || []);
        setPagination(d.pagination);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  // Run search
  useEffect(() => {
    search(1);
  }, []);

  // Reset filter parameters to default
  const reset = () => {
    setFilters({
      suburb: "",
      state: "",
      postcode: "",
      propertyType: "",
      minimumBedrooms: "",
      maximumBedrooms: "",
      minimumRent: "",
      maximumRent: "",
      sortBy: "id",
      sortOrder: "asc",
    });
  };

  // Return page
  return (
    <div>
      <div className="page-header">
        <h1>Find your next rental</h1>
        <p>
          Browsing {pagination ? pagination.total.toLocaleString() : "—"}{" "}
          properties across Australia
        </p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Suburb</label>
          <input
            value={filters.suburb}
            onChange={(e) => set("suburb", e.target.value)}
            placeholder="e.g. Newtown"
            onKeyDown={(e) => e.key === "Enter" && search(1)}
          />
        </div>
        <div className="filter-group">
          <label>State</label>
          <select
            value={filters.state}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Postcode</label>
          <input
            value={filters.postcode}
            onChange={(e) => set("postcode", e.target.value)}
            placeholder="e.g. 4000"
            type="number"
          />
        </div>
        <div className="filter-group">
          <label>Property type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => set("propertyType", e.target.value)}
          >
            <option value="">Any type</option>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Min beds</label>
          <input
            value={filters.minimumBedrooms}
            onChange={(e) => set("minimumBedrooms", e.target.value)}
            type="number"
            min="0"
            placeholder="0"
          />
        </div>
        <div className="filter-group">
          <label>Max beds</label>
          <input
            value={filters.maximumBedrooms}
            onChange={(e) => set("maximumBedrooms", e.target.value)}
            type="number"
            min="0"
            placeholder="Any"
          />
        </div>
        <div className="filter-group">
          <label>Min rent $</label>
          <input
            value={filters.minimumRent}
            onChange={(e) => set("minimumRent", e.target.value)}
            type="number"
            min="0"
            placeholder="0"
          />
        </div>
        <div className="filter-group">
          <label>Max rent $</label>
          <input
            value={filters.maximumRent}
            onChange={(e) => set("maximumRent", e.target.value)}
            type="number"
            min="0"
            placeholder="Any"
          />
        </div>
        <div className="filter-group">
          <label>Sort by</label>
          <select
            value={filters.sortBy}
            onChange={(e) => set("sortBy", e.target.value)}
          >
            <option value="id">Default</option>
            <option value="rent">Rent</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="averageRating">Rating</option>
            <option value="suburb">Suburb</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Order</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => set("sortOrder", e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="filter-actions filter-group">
          <label>&nbsp;</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-primary" onClick={() => search(1)}>
              Search
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="loading">Loading properties…</div>}

      {!loading && results.length === 0 && (
        <div className="empty-state">
          <strong>No properties found</strong>
          <p>Try adjusting your filters</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="property-grid">
            {results.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
          {pagination && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={!pagination.prevPage}
                onClick={() => search(page - 1)}
              >
                ← Prev
              </button>
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                className="page-btn"
                disabled={!pagination.nextPage}
                onClick={() => search(page + 1)}
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