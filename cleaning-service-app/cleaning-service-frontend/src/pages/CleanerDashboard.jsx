import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import StatusBadge from "../components/StatusBadge";
import { getServiceImage } from "../utils/serviceImages";

export default function CleanerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/bookings");
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setBookings(data);
    } catch {
      setError("Could not load assigned bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setError("");
    setSuccess("");
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => ((b.id || b.booking_id) === bookingId ? { ...b, status: newStatus } : b))
      );
      setSuccess(`Booking #${bookingId} marked as ${newStatus}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Staff Portal</span>
            <h1>Cleaner Schedule & Jobs</h1>
            <p>Welcome back, {user?.full_name || "Cleaner"}. View your service jobs and update completion status.</p>
          </div>
        </div>

        {loading && <LoadingSpinner text="Loading jobs..." />}
        <ErrorMessage message={error} onRetry={load} />
        <SuccessMessage message={success} />

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <h3>No scheduled jobs found</h3>
            <p>New customer bookings will appear here.</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem", marginTop: "1.5rem" }}>
          {bookings.map((item) => {
            const bookingId = item.id || item.booking_id;
            const imgUrl = getServiceImage({
              service_name: item.service_name,
              id: item.service_id,
              image: item.service_image
            });
            return (
              <div key={bookingId} className="booking-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className="booking-card-top-row">
                    <div className="booking-thumb">
                      <img src={imgUrl} alt={item.service_name || "Cleaning service"} loading="lazy" />
                    </div>
                    <div className="booking-card-main-info">
                      <div className="booking-card-head">
                        <div>
                          <span className="eyebrow">Job #{bookingId}</span>
                          <h3>{item.service_name || `Service #${item.service_id}`}</h3>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div><span>Customer</span><strong>{item.customer_name || `User #${item.user_id}`}</strong></div>
                    <div><span>Phone</span><strong>{item.customer_phone || "—"}</strong></div>
                    <div><span>Date</span><strong>{item.booking_date}</strong></div>
                    <div><span>Time</span><strong>{item.booking_time}</strong></div>
                    <div><span>Address</span><strong>{item.address}</strong></div>
                  </div>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.5rem" }}>
                  {item.status !== "Completed" && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-full"
                      disabled={updatingId === bookingId}
                      onClick={() => handleUpdateStatus(bookingId, "Completed")}
                    >
                      {updatingId === bookingId ? "Updating..." : "✓ Mark Completed"}
                    </button>
                  )}
                  {item.status === "Pending" && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-full"
                      disabled={updatingId === bookingId}
                      onClick={() => handleUpdateStatus(bookingId, "Confirmed")}
                    >
                      Confirm Job
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
