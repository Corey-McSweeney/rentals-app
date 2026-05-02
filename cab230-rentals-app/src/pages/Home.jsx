import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Create 4 step process component
const steps = [
  {
    num: "01",
    title: "Create an account",
    desc: "Register for free in seconds. Use your email and set up a password to get started.",
  },
  {
    num: "02",
    title: "Browse rentals",
    desc: "Search thousands of Australian rental properties. Filter with a number of characteristics to find your ideal property.",
  },
  {
    num: "03",
    title: "Find your dream rental",
    desc: "Dive into full property details, and view other tenant's reviews to pick the most suitable property.",
  },
  {
    num: "04",
    title: "Rate your experience",
    desc: "Lived there or inspected it? Let others know about your experience with a star rating.",
  },
];

export default function HomePage() {
  const loggedIn = !!localStorage.getItem("token");

  // Home page components
  return (
    <div className="home">
      {/* ── Hero Card for home page ── */}
      <div className="hero-card">
        <div className="hero-card-inner">
          <div className="hero-eyebrow">Australia's Leading Rental Site</div>
          <h1 className="hero-title">rentr.</h1>
          <p className="hero-sub">
            Discover, compare, and rate rental properties across every state and
            territory. Real listings. Real reviews. No fluff.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">6,700+</span>
              <span className="hero-stat-lbl">Properties</span>
            </div>
            <div className="hero-stat-div" />
            <div className="hero-stat">
              <span className="hero-stat-num">8</span>
              <span className="hero-stat-lbl">States &amp; territories</span>
            </div>
            <div className="hero-stat-div" />
            <div className="hero-stat">
              <span className="hero-stat-num">Free</span>
              <span className="hero-stat-lbl">Always</span>
            </div>
          </div>
        </div>
        {/* Create card with dummy data for example property */}
        <div className="hero-card-deco">
          <div className="deco-circle deco-c1" />
          <div className="deco-circle deco-c2" />
          <div className="deco-card-float">
            <div className="float-badge">🏡 Featured</div>
            <div className="float-title">QUT | Gardens Point Campus</div>
            <div className="float-loc">Southbank, Qld</div>
            <div className="float-row">
              <span>🛏 2</span>
              <span>🚿 1</span>
              <span>🚗 2</span>
            </div>
            <div className="float-price">
              $450<span>/wk</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works component ── */}
      <div className="steps-section">
        <div className="steps-header">
          <h2>How we work</h2>
          <p>Four simple steps to get you moving</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Call to Action component ── */}
      <div className="cta-row">
        <Link to="/search" className="cta-btn cta-primary">
          Browse Properties →
        </Link>
        {loggedIn ? (
          <Link to="/ratings" className="cta-btn cta-ghost">
            View my ratings
          </Link>
        ) : (
          <Link to="/register" className="cta-btn cta-ghost">
            Create an account
          </Link>
        )}
      </div>
    </div>
  );
}
