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
  const [processingPayment, setProcessingPayment] = useState(false);

  const userId = user?.id || user?.user_id;

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
    setError("");
    setSuccess("");
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!payingBooking) return;

    setProcessingPayment(true);
    setError("");
    const bookingId = payingBooking.id || payingBooking.booking_id;
    const amount = payingBooking.service_price || 1200;

    try {
      await api.post("/payments", {
        booking_id: bookingId,
        amount: Number(amount),
        payment_method: paymentMethod,
        payment_status: "Completed"
      });

      setSuccess(`Payment of ${amount} ETB via ${paymentMethod} was successful!`);
      setPayingBooking(null);
      load(); // Reload bookings with updated payment status
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed.");
    } finally {
      setProcessingPayment(false);
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
              />
            );
          })}
        </div>

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

              <label className="form-field full-span">
                <span>Select Payment Method</span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="Telebirr">Telebirr (Mobile Payment)</option>
                  <option value="CBE Birr">CBE Birr</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Bank Transfer">Bank Transfer / Amole</option>
                </select>
              </label>

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