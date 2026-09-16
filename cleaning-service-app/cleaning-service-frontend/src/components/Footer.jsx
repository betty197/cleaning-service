import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">✨</span>
            <span>Clean<span>Pro</span></span>
          </div>
          <p className="footer-text">
            Addis Ababa's trusted cleaning management service. Bringing immaculate cleanliness, hygiene, and peace of mind to homes, apartments, and corporate offices.
          </p>
          <div className="footer-badges">
            <span className="footer-pill">🛡️ Fully Insured</span>
            <span className="footer-pill">🌿 Eco Certified</span>
            <span className="footer-pill">⭐ 4.9/5 Rated</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/services">All Services</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/login">Sign In</Link>
        </div>

        {/* Customer Portal */}
        <div>
          <h3>Customer</h3>
          <Link to="/booking">Book a Service</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/profile">My Profile</Link>
        </div>

        {/* Payment & Contact */}
        <div>
          <h3>Payment Methods</h3>
          <p style={{ fontSize: "0.88rem", color: "#94a7be", margin: "0 0 12px" }}>
            Secure and convenient local payment options supported:
          </p>
          <div className="footer-payment-methods">
            <span className="payment-badge">Telebirr</span>
            <span className="payment-badge">CBE Birr</span>
            <span className="payment-badge">Bank Transfer</span>
            <span className="payment-badge">Cash on Delivery</span>
          </div>
          <div style={{ marginTop: "18px", fontSize: "0.85rem", color: "#94a7be" }}>
            <span>📍 Bole Subcity, Addis Ababa, Ethiopia</span><br />
            <span>📞 +251 911 000 001</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div>© {new Date().getFullYear()} CleanPro Services Inc. All rights reserved.</div>
          <div>A Cleaner Space. A Better Life.</div>
        </div>
      </div>
    </footer>
  );
}