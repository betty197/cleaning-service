import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { getServiceImage } from "../utils/serviceImages";

export default function Booking() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service_id: searchParams.get("service") || "",
    booking_date: "",
    booking_time: "",
    address: user?.address || ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/services");
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setServices(data);
      } catch {
        setError("Could not load cleaning services.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (user?.address && !form.address) {
      setForm((prev) => ({ ...prev, address: user.address }));
    }
  }, [user?.address]);

  const selectedService = services.find(
    (s) => String(s.id || s.service_id) === String(form.service_id)
  );

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const userId = user?.id || user?.user_id;
    if (!userId) {
      setError("Please log in before creating a booking.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bookings", {
        user_id: userId,
        customer_id: userId,
        service_id: Number(form.service_id),
        booking_date: form.booking_date,
        booking_time: form.booking_time,
        address: form.address
      });
      setSuccess("Your booking was submitted successfully!");
      setForm({
        service_id: "",
        booking_date: "",
        booking_time: "",
        address: user?.address || ""
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking could not be created.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <section className="page-section"><div className="container"><LoadingSpinner /></div></section>;

  return (
    <section className="page-section">
      <div className="container narrow-container">
        <div className="page-heading center">
          <span className="eyebrow">Book a Service</span>
          <h1>Schedule your cleaning</h1>
          <p>Choose a service and tell us when and where you need it.</p>
        </div>
        <div className="form-card">
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />

          {selectedService && (
            <div className="booking-service-preview">
              <img
                src={getServiceImage(selectedService)}
                alt={selectedService.service_name}
                className="booking-service-preview-img"
              />
              <div className="booking-service-preview-info">
                <span className="eyebrow">Selected Service</span>
                <h3>{selectedService.service_name}</h3>
                <p>{selectedService.description || "Tailored cleaning for your space."}</p>
                <div className="booking-service-preview-meta">
                  <strong>{selectedService.price} ETB</strong>
                  {selectedService.duration_hours && <span>• {selectedService.duration_hours} hours estimated</span>}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="form-grid">
            <label className="form-field full-span">
              <span>Cleaning service</span>
              <select
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option value={service.id || service.service_id} key={service.id || service.service_id}>
                    {service.service_name} — {service.price} ETB
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Booking date</span>
              <input
                type="date"
                value={form.booking_date}
                onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
                required
              />
            </label>
            <label className="form-field">
              <span>Booking time</span>
              <input
                type="time"
                value={form.booking_time}
                onChange={(e) => setForm({ ...form, booking_time: e.target.value })}
                required
              />
            </label>
            <label className="form-field full-span">
              <span>Cleaning address</span>
              <textarea
                rows="3"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Enter your street address, apartment/house number"
                required
              />
            </label>
            <button className="btn btn-primary btn-full full-span" disabled={submitting} type="submit">
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
          </form>
          {success && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <Link className="text-link booking-next" to="/my-bookings">
                View My Bookings →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}