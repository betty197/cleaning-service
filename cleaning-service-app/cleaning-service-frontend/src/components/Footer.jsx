import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">C</span>
            <span>Clean<span>Pro</span></span>
          </div>
          <p className="footer-text">
            Reliable cleaning for homes, offices, and businesses. A cleaner space starts here.
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <h3>Customer</h3>
          <Link to="/booking">Book a Service</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} CleanPro. All rights reserved.</div>
      </div>
    </footer>
  );
}