import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingResponse, serviceResponse] = await Promise.all([
        api.get("/bookings"),
        api.get("/services")
      ]);
      const allBookings = Array.isArray(bookingResponse.data) ? bookingResponse.data : bookingResponse.data?.data || [];
      const serviceData = Array.isArray(serviceResponse.data) ? serviceResponse.data : serviceResponse.data?.data || [];
      setServices(serviceData);
      setBookings(user?.id ? allBookings.filter((item) => Number(item.customer_id) === Number(user.id)) : []);
    } catch {
      setError("Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id]);

  const getServiceName = (id) => services.find((item) => Number(item.id) === Number(id))?.service_name;

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading"><div><span className="eyebrow">Customer Dashboard</span><h1>My Bookings</h1><p>Track your scheduled cleaning services.</p></div></div>
        {loading && <LoadingSpinner text="Loading your bookings..." />}
        <ErrorMessage message={error} onRetry={load} />
        {!loading && !error && bookings.length === 0 && <div className="empty-state"><h3>No bookings yet</h3><p>Your submitted bookings will appear here.</p></div>}
        <div className="booking-grid">
          {bookings.map((booking) => <BookingCard key={booking.id} booking={booking} serviceName={getServiceName(booking.service_id)} />)}
        </div>
      </div>
    </section>
  );
}