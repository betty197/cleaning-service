import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (loggedUser.role === "cleaner") {
        navigate("/cleaner", { replace: true });
      } else {
        navigate("/my-bookings", { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setForm({ email, password });
    setError("");
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Welcome back</span>
          <h1>Login to CleanPro</h1>
          <p>Access your bookings, profile, and cleaning management portal.</p>
        </div>

        <form onSubmit={handleLogin} className="form-grid">
          <FormInput
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />

          <ErrorMessage message={error} />

          <button
            className="btn btn-primary btn-full full-span"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {loading && <LoadingSpinner text="Authenticating..." />}

        {/* Demo Quick Fill Helper */}
        <div className="demo-accounts-box" style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Demo Accounts (Click to Fill)
          </span>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}
              onClick={() => handleQuickFill("admin@cleanpro.com", "admin123")}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}
              onClick={() => handleQuickFill("customer@cleanpro.com", "customer123")}
            >
              👤 Customer
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}
              onClick={() => handleQuickFill("cleaner@cleanpro.com", "cleaner123")}
            >
              🧹 Cleaner Staff
            </button>
          </div>
        </div>

        <p className="auth-footer" style={{ marginTop: "1.25rem" }}>
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}