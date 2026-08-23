import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/" onClick={close}>
          <span className="brand-mark">C</span>
          <span>Clean<span>Pro</span></span>
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <NavLink to="/" onClick={close}>Home</NavLink>
          <NavLink to="/services" onClick={close}>Services</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <NavLink className="nav-book" to="/booking" onClick={close}>Book Now</NavLink>
          {isAuthenticated && user?.role === "customer" && <NavLink to="/my-bookings" onClick={close}>My Bookings</NavLink>}
          {isAuthenticated && user?.role === "cleaner" && <NavLink to="/cleaner" onClick={close}>Jobs Schedule</NavLink>}
          {isAuthenticated && <NavLink to="/profile" onClick={close}>Profile</NavLink>}
          {!isAuthenticated && <NavLink to="/login" onClick={close}>Login</NavLink>}
          {!isAuthenticated && <NavLink className="nav-register" to="/register" onClick={close}>Register</NavLink>}
          {isAuthenticated && user?.role === "admin" && <NavLink to="/admin" onClick={close}>Admin</NavLink>}
          {isAuthenticated && (
            <button className="nav-logout" type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}