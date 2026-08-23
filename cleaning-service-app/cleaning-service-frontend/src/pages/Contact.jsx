import { useState } from "react";
import FormInput from "../components/FormInput";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Name, email, and message are required.");
      return;
    }
    setError("");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading center">
          <span className="eyebrow">Get In Touch</span>
          <h1>Contact CleanPro</h1>
          <p>Have questions or special cleaning requests? We are here to help.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
          {/* Contact Details Card */}
          <div className="profile-card" style={{ height: "fit-content" }}>
            <h3 style={{ marginBottom: "1.25rem" }}>Our Office</h3>
            <div className="profile-list">
              <div>
                <span>📍 Location</span>
                <strong>Bole Subcity, Addis Ababa, Ethiopia</strong>
              </div>
              <div>
                <span>📞 Phone</span>
                <strong>+251 911 000 001 / +251 922 000 002</strong>
              </div>
              <div>
                <span>✉️ Email</span>
                <strong>support@cleanpro.com</strong>
              </div>
              <div>
                <span>🕒 Working Hours</span>
                <strong>Monday – Saturday: 8:00 AM – 7:00 PM</strong>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
              <strong style={{ display: "block", color: "#0f172a", marginBottom: "0.25rem" }}>Emergency Cleaning?</strong>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
                For same-day or emergency cleaning service, please call our hotline directly.
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3>Send us a message</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Fill out the form below and our team will get back to you within 2 business hours.
            </p>

            {submitted && <SuccessMessage message="Thank you! Your message has been received. Our team will contact you shortly." />}
            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} className="form-grid">
              <FormInput label="Full Name" name="name" value={form.name} onChange={update} placeholder="Your name" required />
              <FormInput label="Email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required />
              <FormInput label="Phone Number" name="phone" value={form.phone} onChange={update} placeholder="+251..." />
              <FormInput label="Subject" name="subject" value={form.subject} onChange={update} placeholder="Booking inquiry, quote, etc." />
              <label className="form-field full-span">
                <span>Message</span>
                <textarea rows="4" name="message" value={form.message} onChange={update} placeholder="How can we help you?" required />
              </label>
              <button className="btn btn-primary full-span" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
