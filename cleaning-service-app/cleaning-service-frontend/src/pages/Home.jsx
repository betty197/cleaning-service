import { Link } from "react-router-dom";

const heroImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1500&q=85";

export default function Home() {
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

      <section className="section section-white" id="about">
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

      <section className="section section-soft">
        <div className="container split-section">
          <div>
            <span className="eyebrow">Built for busy people</span>
            <h2>More time for what matters.</h2>
            <p>
              From everyday home cleaning to professional office care, CleanPro gives you a straightforward way to request and manage cleaning services.
            </p>
            <Link className="btn btn-primary" to="/services">Explore Services</Link>
          </div>
          <div className="feature-panel">
            <div><strong>01</strong><span>Choose a service</span></div>
            <div><strong>02</strong><span>Select your schedule</span></div>
            <div><strong>03</strong><span>Track your booking</span></div>
            <div><strong>04</strong><span>Manage payment information</span></div>
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