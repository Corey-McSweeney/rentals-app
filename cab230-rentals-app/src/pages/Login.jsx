// Import
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL as API, jsonHeaders } from "../api";

// Main login page
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Submission handle function
  const submit = () => {
    // Validate inputs
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    // Send login request to API
    fetch(`${API}/user/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    })
      // Handle failures
      .then((r) => {
        if (r.status === 401) throw new Error("Incorrect email or password.");
        if (!r.ok) throw new Error("Something went wrong. Please try again.");
        return r.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("auth"));
        navigate("/");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Main login form UI components
  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Welcome back</h2>
        <p>Sign in to rate properties and view your history.</p>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <button
          className="btn btn-primary form-submit"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
