import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import FormInput from "../components/FormInput";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.full_name || !form.email || !form.password) {
      setError("Full name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users", form);
      setSuccess("Account created successfully. You can continue to the login page once backend authentication is available.");
      setForm({ full_name: "", email: "", phone: "", password: "", address: "" });
    } catch (requestError) {
      const message = requestError.response?.data?.message;
      setError(message || "Registration failed. Please check your information and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Join CleanPro</span>
          <h1>Create your account</h1>
          <p>Register your customer profile so your information can be used by the booking system.</p>
        </div>
        <form onSubmit={submit} className="form-grid">
          <FormInput label="Full name" name="full_name" value={form.full_name} onChange={update} placeholder="Your full name" required />
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required />
          <FormInput label="Phone" name="phone" value={form.phone} onChange={update} placeholder="+251..." />
          <FormInput label="Password" name="password" type="password" value={form.password} onChange={update} placeholder="Create a password" required minLength={6} />
          <label className="form-field full-span"><span>Address</span><textarea name="address" value={form.address} onChange={update} rows="4" placeholder="Your address" /></label>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <button className="btn btn-primary btn-full full-span" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        {loading && <LoadingSpinner text="Sending registration..." />}
        <p className="auth-footer">Already registered? <Link to="/login">Open login</Link></p>
      </div>
    </section>
  );
}