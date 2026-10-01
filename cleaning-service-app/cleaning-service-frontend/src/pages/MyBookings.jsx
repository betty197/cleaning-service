import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import Modal from "../components/Modal";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Payment state
  const [payingBooking, setPayingBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Telebirr");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [savingBookingId, setSavingBookingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const userId = user?.id || user?.user_id;
  const currentDate = new Date();
  const minimumBookingDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const [bookingResponse, serviceResponse] = await Promise.all([
        api.get(`/bookings?user_id=${userId}`),
        api.get("/services")
      ]);
      const bookingData = Array.isArray(bookingResponse.data) ? bookingResponse.data : bookingResponse.data?.data || [];
      const serviceData = Array.isArray(serviceResponse.data) ? serviceResponse.data : serviceResponse.data?.data || [];
      setServices(serviceData);
      setBookings(bookingData);
    } catch {
      setError("Could not load your bookings. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const getServiceName = (booking) => {
    if (booking.service_name) return booking.service_name;
    const found = services.find((item) => Number(item.id || item.service_id) === Number(booking.service_id));
    return found?.service_name || `Service #${booking.service_id}`;
  };

  const handleOpenPayment = (booking) => {
    setPayingBooking(booking);
    setPaymentMethod("Telebirr");
    setPaymentAccount("");
    setError("");
    setSuccess("");
  };

  const paymentOptions = [
    { value: "Telebirr", label: "Telebirr", icon: "📱", description: "Mobile payment" },
    { value: "CBE Birr", label: "CBE Birr", icon: "🏦", description: "Bank wallet" },
    { value: "Cash on Delivery", label: "Cash on Delivery", icon: "💵", description: "Pay on delivery" },
    { value: "Bank Transfer", label: "Bank Transfer / Amole", icon: "💳", description: "Bank account" }
  ];

  const accountLabel = paymentMethod === "Telebirr"
    ? "SK Telebirr account"
    : paymentMethod === "CBE Birr"
      ? "CBE account"
      : paymentMethod === "Bank Transfer"
        ? "Bank transfer / Amole account"
        : "Payment account";

  const accountPlaceholder = paymentMethod === "Telebirr"
    ? "Enter the SK Telebirr account or phone number"
    : paymentMethod === "CBE Birr"
      ? "Enter the CBE account number"
      : paymentMethod === "Bank Transfer"
        ? "Enter the bank transfer or Amole account details"
        : "Enter payment reference";

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!payingBooking) return;

    const requiresAccount = ["Telebirr", "CBE Birr", "Bank Transfer"].includes(paymentMethod);
    if (requiresAccount && !paymentAccount.trim()) {
      setError(`Please enter the ${accountLabel.toLowerCase()} before continuing.`);
      return;
    }

    setProcessingPayment(true);
    setError("");
    const bookingId = payingBooking.id || payingBooking.booking_id;
    const amount = payingBooking.service_price || 1200;

    try {
      await api.post("/payments", {
        booking_id: bookingId,
        amount: Number(amount),
        payment_method: paymentMethod,
        account_type: paymentMethod,
        payment_account: paymentAccount.trim(),
        payment_status: "Completed"
      });

      setSuccess(`Payment of ${amount} ETB via ${paymentMethod} was successful!`);
      setPayingBooking(null);
      setPaymentAccount("");
      load(); // Reload bookings with updated payment status
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleOpenEdit = (booking) => {
    setEditingBooking({
      ...booking,
      service_id: String(booking.service_id),
      booking_time: String(booking.booking_time || "").slice(0, 5),
      address: booking.address || ""
    });
    setActionError("");
    setError("");
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingBooking) return;

    const bookingId = editingBooking.id || editingBooking.booking_id;
    setSavingBookingId(bookingId);
    setActionError("");
    try {
      const response = await api.put(`/bookings/${bookingId}/details`, {
        service_id: Number(editingBooking.service_id),
        booking_date: editingBooking.booking_date,
        booking_time: editingBooking.booking_time,
        address: editingBooking.address
      });
      const updated = response.data?.booking || response.data?.data || editingBooking;
      setBookings((items) => items.map((item) =>
        (item.id || item.booking_id) === bookingId ? updated : item
      ));
      setEditingBooking(null);
      setSuccess("Your booking was updated successfully.");
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Booking could not be updated.");
    } finally {
      setSavingBookingId(null);
    }
  };

  const handleCancelBooking = async (booking) => {
    const bookingId = booking.id || booking.booking_id;
    if (!window.confirm("Cancel this booking? A payment refund is not processed automatically.")) return;

    setSavingBookingId(bookingId);
    setError("");
    setSuccess("");
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      const updated = response.data?.booking || response.data?.data || { ...booking, status: "Cancelled" };
      setBookings((items) => items.map((item) =>
        (item.id || item.booking_id) === bookingId ? updated : item
      ));
      setSuccess("Your booking was cancelled.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking could not be cancelled.");
    } finally {
      setSavingBookingId(null);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="eyebrow">Customer Dashboard</span>
            <h1>My Bookings</h1>
            <p>Track your scheduled cleaning services, payment status, and upcoming visits.</p>
          </div>
          <Link to="/booking" className="btn btn-primary">
            + New Booking
          </Link>
        </div>

        {loading && <LoadingSpinner text="Loading your bookings..." />}
        <ErrorMessage message={error} onRetry={load} />
        <SuccessMessage message={success} />

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state" style={{ padding: "3rem 1.5rem", textAlign: "center", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3>No bookings yet</h3>
            <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem" }}>
              You haven't scheduled any cleaning services yet.
            </p>
            <Link to="/booking" className="btn btn-primary">
              Book Your First Cleaning
            </Link>
          </div>
        )}

        <div className="booking-grid">
          {bookings.map((booking) => {
            const foundService = services.find(
              (item) => Number(item.id || item.service_id) === Number(booking.service_id)
            );
            return (
              <BookingCard
                key={booking.id || booking.booking_id}
                booking={booking}
                service={foundService}
                serviceName={getServiceName(booking)}
                onPay={handleOpenPayment}
                onEdit={handleOpenEdit}
                onCancel={handleCancelBooking}
                saving={savingBookingId === (booking.id || booking.booking_id)}
              />
            );
          })}
        </div>

        <Modal
          open={Boolean(editingBooking)}
          title={`Edit Booking #${editingBooking?.id || editingBooking?.booking_id}`}
          onClose={() => {
            if (!savingBookingId) {
              setEditingBooking(null);
              setActionError("");
            }
          }}
        >
          {editingBooking && (
            <>
              <ErrorMessage message={actionError} />
              <form className="form-grid" onSubmit={handleEditSubmit}>
                <label className="form-field full-span">
                  <span>Cleaning service</span>
                  <select
                    value={editingBooking.service_id}
                    onChange={(event) => setEditingBooking({ ...editingBooking, service_id: event.target.value })}
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
                    min={minimumBookingDate}
                    value={editingBooking.booking_date || ""}
                    onChange={(event) => setEditingBooking({ ...editingBooking, booking_date: event.target.value })}
                    required
                  />
                </label>
                <label className="form-field">
                  <span>Booking time</span>
                  <input
                    type="time"
                    value={editingBooking.booking_time}
                    onChange={(event) => setEditingBooking({ ...editingBooking, booking_time: event.target.value })}
                    required
                  />
                </label>
                <label className="form-field full-span">
                  <span>Cleaning address</span>
                  <textarea
                    rows="3"
                    maxLength="255"
                    value={editingBooking.address}
                    onChange={(event) => setEditingBooking({ ...editingBooking, address: event.target.value })}
                    required
                  />
                </label>
                <div className="booking-edit-actions full-span">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={savingBookingId === (editingBooking.id || editingBooking.booking_id)}
                    onClick={() => setEditingBooking(null)}
                  >
                    Keep Booking
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={savingBookingId === (editingBooking.id || editingBooking.booking_id)}
                  >
                    {savingBookingId === (editingBooking.id || editingBooking.booking_id) ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          )}
        </Modal>

        {/* Payment Modal */}
        <Modal
          open={Boolean(payingBooking)}
          title={`Pay for Booking #${payingBooking?.id || payingBooking?.booking_id}`}
          onClose={() => setPayingBooking(null)}
        >
          {payingBooking && (
            <form className="form-grid" onSubmit={handlePaySubmit}>
              <div className="detail-list full-span">
                <div><span>Service</span><strong>{getServiceName(payingBooking)}</strong></div>
                <div><span>Date & Time</span><strong>{payingBooking.booking_date} at {payingBooking.booking_time}</strong></div>
                <div><span>Amount Due</span><strong>{payingBooking.service_price || 1200} ETB</strong></div>
              </div>

              <div className="form-field full-span">
                <span>Select Payment Method</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {paymentOptions.map((option) => {
                    const isSelected = paymentMethod === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(option.value);
                          setPaymentAccount("");
                        }}
                        aria-pressed={isSelected}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.9rem 1rem",
                          borderRadius: "12px",
                          border: isSelected ? "1.5px solid #2563eb" : "1px solid #dbe4f0",
                          background: isSelected ? "#eff6ff" : "#ffffff",
                          color: "#0f172a",
                          textAlign: "left",
                          cursor: "pointer",
                          boxShadow: isSelected ? "0 0 0 3px rgba(37, 99, 235, 0.12)" : "none",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{option.icon}</span>
                        <span>
                          <strong style={{ display: "block", fontSize: "0.95rem" }}>{option.label}</strong>
                          <small style={{ color: "#64748b" }}>{option.description}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {["Telebirr", "CBE Birr", "Bank Transfer"].includes(paymentMethod) && (
                <label className="form-field full-span">
                  <span>{accountLabel}</span>
                  <input
                    type="text"
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    placeholder={accountPlaceholder}
                    required
                  />
                </label>
              )}

              <button className="btn btn-primary full-span" disabled={processingPayment} type="submit">
                {processingPayment ? "Processing Payment..." : `Confirm & Pay ${payingBooking.service_price || 1200} ETB`}
              </button>
            </form>
          )}
        </Modal>
      </div>
    </section>
  );
}