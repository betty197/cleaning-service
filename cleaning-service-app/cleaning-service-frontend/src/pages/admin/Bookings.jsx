import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await api.get("/bookings");
      setBookings(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch { setError("Could not load bookings."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (booking, status) => {
    setSavingId(booking.id); setError("");
    try {
      const response = await api.put(`/bookings/${booking.id}`, { ...booking, status });
      const updated = response.data?.data || response.data;
      setBookings((items) => items.map((item) => item.id === booking.id ? updated : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking status could not be updated.");
    } finally { setSavingId(null); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try { await api.delete(`/bookings/${id}`); setBookings((items) => items.filter((item) => item.id !== id)); }
    catch { setError("Booking could not be deleted."); }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading"><div><span className="eyebrow">Administration</span><h1>Bookings</h1><p>Review customer bookings and update their status.</p></div></div>
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} onRetry={load} />
        {!loading && <div className="table-card"><div className="table-scroll"><table><thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {bookings.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.customer_id}</td><td>{item.service_id}</td><td>{item.booking_date}</td><td>{item.booking_time}</td><td><StatusBadge status={item.status} /></td><td><div className="table-actions"><select disabled={savingId === item.id} value={item.status || "Pending"} onChange={(e) => updateStatus(item, e.target.value)}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select><button className="danger-text" onClick={() => remove(item.id)}>Delete</button></div></td></tr>)}
        </tbody></table></div>{bookings.length === 0 && <div className="empty-inline">No bookings found.</div>}</div>}
      </div>
    </section>
  );
}