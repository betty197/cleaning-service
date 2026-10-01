import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";

const heroImage = "https://images.unsplash.com/photo-1781637590564-01c65dbf2039?auto=format&fit=crop&w=2000&q=85";

const fallbackServices = [
  {
    id: 1,
    service_name: "Home & Residential Cleaning",
    description: "Reliable everyday home care for living rooms, bedrooms, and common areas. Dust-free, fresh, and welcoming.",
    price: 1500,
    duration_hours: 2,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
    status: "Best Value"
  },
  {
    id: 2,
    service_name: "Deep Cleaning",
    description: "Intensive, detailed scrub for kitchens, bathrooms, tiles, baseboards, and hard-to-reach corners.",
    price: 1800,
    duration_hours: 3,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
    status: "Top Rated"
  },
  {
    id: 3,
    service_name: "Home Office Cleaning",
    description: "Dusting, sanitizing, and organizing your workspace for a productive, distraction-free environment.",
    price: 1200,
    duration_hours: 2,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
    status: "Popular"
  }
];

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState(fallbackServices);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await api.get("/services");
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setFeaturedServices(data.length > 0 ? data.slice(0, 3) : fallbackServices);
      } catch {
        setFeaturedServices(fallbackServices);
      }
    };
    loadFeatured();
  }, []);

  return (
    <>
      {/* ---------- Hero Section ---------- */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-overlay-glow" />
        <img
          className="hero-image"
          src={heroImage}
          alt="Cleaner wearing workwear and gloves while vacuuming a carpeted office"
        />
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-sparkle">✨</span>
            <span>Addis Ababa's Premier Cleaning Service</span>
          </div>

          <h1>
            Professional Cleaning.<br />
            <span className="gradient-text">A Cleaner Space. A Better Life.</span>
          </h1>

          <p className="hero-description">
            Experience the joy of a spotless space without the hassle. Vetted, background-checked specialists delivering pristine results for homes, offices, and commercial spaces.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/booking">
              Book a Service →
            </Link>
            <Link className="btn btn-outline-light btn-lg" to="/services">
              View All Services
            </Link>
          </div>

        </div>
      </section>

      {/* ---------- Trust Metrics Strip ---------- */}
      <section className="trust-strip">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon-box">⚡</div>
            <div className="trust-text">
              <strong>Instant Booking</strong>
              <span>Reserve your slot in under 60 seconds</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">🛡️</div>
            <div className="trust-text">
              <strong>100% Vetted Cleaners</strong>
              <span>Thorough background & skills verified</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">🌿</div>
            <div className="trust-text">
              <strong>Eco-Friendly Products</strong>
              <span>Non-toxic & safe for pets and children</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box">💳</div>
            <div className="trust-text">
              <strong>Flexible Payments</strong>
              <span>Telebirr, CBE Birr, or Cash on Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Featured Services ---------- */}
      <section className="section section-white">
        <div className="container">
          <div className="page-heading">
            <div>
              <span className="eyebrow">POPULAR SOLUTIONS</span>
              <h2>Featured Cleaning Services</h2>
              <p>Top-rated professional services ready for immediate online booking.</p>
            </div>
            <Link to="/services" className="btn btn-secondary">
              View All Services →
            </Link>
          </div>

          <div className="service-grid">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id || service.service_id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How It Works (3 Steps) ---------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">SIMPLE 3-STEP PROCESS</span>
            <h2>How CleanPro Works</h2>
            <p>Booking professional cleaning has never been this effortless and transparent.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num-badge">01</div>
              <h3>Choose Your Service</h3>
              <p>Browse our curated range of residential, deep cleaning, and office care packages customized to your space.</p>
            </div>
            <div className="step-card">
              <div className="step-num-badge">02</div>
              <h3>Schedule Your Slot</h3>
              <p>Select your preferred date, time, and address. Receive instant booking confirmation and real-time updates.</p>
            </div>
            <div className="step-card">
              <div className="step-num-badge">03</div>
              <h3>Enjoy a Spotless Space</h3>
              <p>Our vetted cleaner arrives on time with premium equipment, leaving your space sparkling and refreshed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why CleanPro / Split Section ---------- */}
      <section className="section section-white">
        <div className="container split-section">
          <div>
            <span className="eyebrow">THE CLEANPRO STANDARD</span>
            <h2>More time for what matters most.</h2>
            <p>
              Cleaning shouldn't take up your precious weekends. From routine dusting to thorough post-renovation sanitization, CleanPro provides dependable, five-star care you can rely on every single time.
            </p>
            <div style={{ marginTop: "28px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" to="/booking">Book a Cleaning Now →</Link>
              <Link className="btn btn-secondary" to="/services">Explore Services</Link>
            </div>
          </div>

          <div className="feature-panel">
            <div className="feature-item">
              <span className="feature-num">01</span>
              <div className="feature-text">
                <strong>Trained & Vetted Specialists</strong>
                <p>Every cleaner undergoes background verification and professional training for quality assurance.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">02</span>
              <div className="feature-text">
                <strong>Modern Equipment & Eco Supplies</strong>
                <p>We bring high-performance vacuums, steam cleaners, and child/pet-safe sanitizing agents.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">03</span>
              <div className="feature-text">
                <strong>Live Job Status Tracking</strong>
                <p>Monitor assigned cleaners, visit timing, and appointment progress directly from your dashboard.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-num">04</span>
              <div className="feature-text">
                <strong>100% Satisfaction Guarantee</strong>
                <p>If you're not completely satisfied with any area, let us know within 24 hours and we'll re-clean it free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Client Testimonials ---------- */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">WHAT OUR CLIENTS SAY</span>
            <h2>Loved by homes and businesses</h2>
            <p>Read genuine reviews from homeowners, tenants, and business managers who trust CleanPro.</p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "CleanPro completely transformed our home before our family holiday party. The kitchen and bathrooms were literally gleaming. Absolutely worth every birr!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">BT</div>
                <div className="testimonial-author-info">
                  <strong>Bethlehem Tadesse</strong>
                  <span>Homeowner • Bole Subcity</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "We use CleanPro for our 20-person startup office in Kazanchis. Always punctual, thorough, and very courteous. Makes scheduling office cleanings effortless."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">DK</div>
                <div className="testimonial-author-info">
                  <strong>Dawit Kebede</strong>
                  <span>Operations Lead • Kazanchis</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "Booking through the website was so quick, and paying via Telebirr was super smooth. The cleaner did a flawless job on our move-out cleaning. Deposit fully returned!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">HM</div>
                <div className="testimonial-author-info">
                  <strong>Hanna Mengistu</strong>
                  <span>Tenant • CMC, Addis Ababa</span>
                </div>
              </div>
            </div>
          </div>

          {/* 100% Satisfaction Banner */}
          <div className="guarantee-banner" style={{ marginTop: "50px" }}>
            <div className="guarantee-content">
              <h3>🛡️ CleanPro 100% Happiness Guarantee</h3>
              <p>
                Your satisfaction is our top priority. If any spot or area doesn't meet your highest standard, contact us within 24 hours and our team will return to re-clean it at zero additional cost.
              </p>
            </div>
            <Link className="btn btn-light btn-lg" to="/booking" style={{ whiteSpace: "nowrap" }}>
              Experience the Sparkle
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Final Call to Action ---------- */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">READY WHEN YOU ARE</span>
            <h2>Give your space the sparkling care it deserves.</h2>
          </div>
          <Link className="btn btn-light btn-lg" to="/booking">
            Book a Cleaning Now →
          </Link>
        </div>
      </section>
    </>
  );
}