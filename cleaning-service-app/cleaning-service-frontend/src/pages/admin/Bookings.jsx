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
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/bookings");
      setBookings(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (booking, status) => {
    const bookingId = booking.id || booking.booking_id;
    setSavingId(bookingId);
    setError("");
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status });
      const updated = response.data?.booking || response.data?.data || { ...booking, status };
      setBookings((items) =>
        items.map((item) => (item.id || item.booking_id) === bookingId ? { ...item, status } : item)
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking status could not be updated.");
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((items) => items.filter((item) => (item.id || item.booking_id) !== id));
    } catch {
      setError("Booking could not be deleted.");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Administration</span>
            <h1>Bookings</h1>
            <p>Review customer appointments, cleaning details, and update statuses.</p>
          </div>
        </div>

        {loading && <LoadingSpinner text="Loading bookings..." />}
        <ErrorMessage message={error} onRetry={load} />

        {!loading && (
          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((item) => {
                    const bookingId = item.id || item.booking_id;
                    return (
                      <tr key={bookingId}>
                        <td><strong>#{bookingId}</strong></td>
                        <td>
                          <div>
                            <strong>{item.customer_name || `User #${item.user_id || item.customer_id}`}</strong>
                            {item.customer_phone && <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.customer_phone}</div>}
                          </div>
                        </td>
                        <td>{item.service_name || `Service #${item.service_id}`}</td>
                        <td>
                          <div>{item.booking_date}</div>
                          <small style={{ color: "#64748b" }}>{item.booking_time}</small>
                        </td>
                        <td style={{ maxWidth: "200px", whiteSpace: "normal" }}>{item.address || "—"}</td>
                        <td><StatusBadge status={item.status} /></td>
                        <td>
                          <div className="table-actions">
                            <select
                              disabled={savingId === bookingId}
                              value={item.status || "Pending"}
                              onChange={(e) => updateStatus(item, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button className="danger-text" onClick={() => remove(bookingId)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {bookings.length === 0 && <div className="empty-inline">No bookings found.</div>}
          </div>
        )}
      </div>
    </section>
  );
}