import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

export default function Booking() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service_id: searchParams.get("service") || "",
    booking_date: "",
    booking_time: "",
    address: ""
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

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("Your authenticated customer ID is unavailable. Add backend authentication before creating a booking.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bookings", {
        customer_id: user.id,
        service_id: Number(form.service_id),
        booking_date: form.booking_date,
        booking_time: form.booking_time,
        address: form.address
      });
      setSuccess("Your booking was submitted successfully.");
      setForm({ service_id: "", booking_date: "", booking_time: "", address: "" });
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
          <form onSubmit={submit} className="form-grid">
            <label className="form-field full-span">
              <span>Cleaning service</span>
              <select value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })} required>
                <option value="">Select a service</option>
                {services.map((service) => <option value={service.id} key={service.id}>{service.service_name}</option>)}
              </select>
            </label>
            <label className="form-field"><span>Booking date</span><input type="date" value={form.booking_date} onChange={(e) => setForm({ ...form, booking_date: e.target.value })} required /></label>
            <label className="form-field"><span>Booking time</span><input type="time" value={form.booking_time} onChange={(e) => setForm({ ...form, booking_time: e.target.value })} required /></label>
            <label className="form-field full-span"><span>Cleaning address</span><textarea rows="4" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></label>
            <button className="btn btn-primary btn-full full-span" disabled={submitting} type="submit">{submitting ? "Submitting..." : "Confirm Booking"}</button>
          </form>
          {success && <Link className="text-link booking-next" to="/my-bookings">View My Bookings →</Link>}
        </div>
      </div>
    </section>
  );
}