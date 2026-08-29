import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";

const heroImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1500&q=85";

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await api.get("/services");
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setFeaturedServices(data.slice(0, 3));
      } catch {
        // Fallback gracefully
      }
    };
    loadFeatured();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />
        <img className="hero-image" src={heroImage} alt="Professional cleaner working in a bright room" />
        <div className="container hero-content">
          <span className="hero-kicker">Professional • Reliable • Trusted</span>
          <h1>Professional Cleaning Services</h1>
          <p className="hero-title">A Cleaner Space.<br />A Better Life.</p>
          <p className="hero-description">
            Reliable cleaning services for homes, offices, and businesses, delivered with care and attention to detail.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/booking">Book a Service</Link>
            <Link className="btn btn-light btn-lg" to="/services">View Services</Link>
          </div>
          <div className="hero-stats">
            <div><strong>01</strong><span>Easy booking</span></div>
            <div><strong>02</strong><span>Reliable service</span></div>
            <div><strong>03</strong><span>Flexible scheduling</span></div>
          </div>
        </div>
      </section>

      {/* Featured Services from Database */}
      {featuredServices.length > 0 && (
        <section className="section section-white">
          <div className="container">
            <div className="page-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span className="eyebrow">Popular Solutions</span>
                <h2>Featured Cleaning Services</h2>
                <p>Top-rated services ready for immediate booking.</p>
              </div>
              <Link to="/services" className="btn btn-secondary">
                View All Services →
              </Link>
            </div>
            <div className="service-grid" style={{ marginTop: "1.5rem" }}>
              {featuredServices.map((service) => (
                <ServiceCard key={service.id || service.service_id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-soft" id="about">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Why CleanPro</span>
            <h2>Cleaning that fits your life</h2>
            <p>We make it simple to request, schedule, and manage professional cleaning services.</p>
          </div>
          <div className="benefit-grid">
            {[
              ["✓", "Professional care", "A polished, dependable experience from booking to completion."],
              ["◷", "Flexible scheduling", "Choose a convenient date and time for your cleaning."],
              ["◆", "Simple management", "Keep your services, bookings, and payment information organized."]
            ].map(([icon, title, text]) => (
              <div className="benefit-card" key={title}>
                <div className="benefit-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container split-section">
          <div>
            <span className="eyebrow">Built for busy people</span>
            <h2>More time for what matters.</h2>
            <p>
              From everyday home cleaning to professional office care, CleanPro gives you a straightforward way to request and manage cleaning services in just a few clicks.
            </p>
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" to="/services">Explore Services</Link>
              <Link className="btn btn-secondary" to="/booking">Book Now →</Link>
            </div>
          </div>
          <div className="feature-panel">
            <div className="feature-item">
              <span className="feature-num">01</span>
              <div className="feature-text">
                <strong>Choose a service</strong>
                <p>Browse customized cleaning options tailored for homes, apartments, or corporate offices.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">02</span>
              <div className="feature-text">
                <strong>Select your schedule</strong>
                <p>Pick your preferred appointment date and time slot that fits your routine.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">03</span>
              <div className="feature-text">
                <strong>Track your booking</strong>
                <p>Monitor assigned cleaners, visit details, and live status in your customer dashboard.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">04</span>
              <div className="feature-text">
                <strong>Manage payment information</strong>
                <p>Conveniently and securely pay via Telebirr, CBE Birr, Cash on Delivery, or Bank Transfer.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">05</span>
              <div className="feature-text">
                <strong>Professional on-site cleaning</strong>
                <p>Vetted, trained cleaning specialists arrive with top-grade equipment and supplies.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">06</span>
              <div className="feature-text">
                <strong>Enjoy a spotless space</strong>
                <p>Relax and enjoy a sparkling, refreshed environment with guaranteed satisfaction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">Ready when you are</span>
            <h2>Give your space the care it deserves.</h2>
          </div>
          <Link className="btn btn-light btn-lg" to="/booking">Book a Cleaning</Link>
        </div>
      </section>
    </>
  );
}