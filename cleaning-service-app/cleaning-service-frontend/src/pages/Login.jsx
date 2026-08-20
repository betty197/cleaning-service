import { Link } from "react-router-dom";

export default function Login() {
  return (
    <section className="auth-section">
      <div className="auth-card login-disabled">
        <div className="auth-copy">
          <span className="eyebrow">Welcome back</span>
          <h1>Login</h1>
          <p>Real authentication is intentionally not faked.</p>
        </div>
        <div className="alert alert-warning">
          <strong>Backend authentication is missing.</strong>
          <p>
            The API list provided for this project contains users, services, bookings, and payments CRUD routes, but no login endpoint.
            The frontend therefore cannot safely authenticate a customer or admin yet.
          </p>
          <p>
            Add a real endpoint such as <code>POST /api/auth/login</code> that verifies the email/password and returns a signed access token plus the authenticated user's role and ID.
          </p>
        </div>
        <div className="login-demo-fields">
          <label className="form-field"><span>Email</span><input disabled placeholder="Authentication endpoint required" /></label>
          <label className="form-field"><span>Password</span><input disabled type="password" placeholder="Authentication endpoint required" /></label>
          <button className="btn btn-primary btn-full" disabled>Login unavailable</button>
        </div>
        <p className="auth-footer">Need an account? <Link to="/register">Register</Link></p>
      </div>
    </section>
  );
}