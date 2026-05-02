// Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL as API, jsonHeaders } from "../api";

// Main Register page
export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Submission button handler
  const submit = () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    fetch(`${API}/user/register`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    })
      // Handle failures
      .then((r) => {
        if (r.status === 409)
          throw new Error("An account with this email already exists.");
        if (!r.ok) throw new Error("Registration failed. Please try again.");
        return r.json();
      })
      .then(() => navigate("/login"))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Main register form UI compoenents
  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Create account</h2>
        <p>Register to start rating and tracking rental properties.</p>
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
            placeholder="Choose a password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <button
          className="btn btn-primary form-submit"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        {/* Error handling button */}
        <div className="form-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
