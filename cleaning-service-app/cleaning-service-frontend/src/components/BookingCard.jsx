import StatusBadge from "./StatusBadge";

export default function BookingCard({ booking, serviceName }) {
  return (
    <article className="booking-card">
      <div className="booking-card-head">
        <div>
          <span className="eyebrow">Booking #{booking.id}</span>
          <h3>{serviceName || `Service #${booking.service_id}`}</h3>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="booking-details">
        <div><span>Date</span><strong>{booking.booking_date || "—"}</strong></div>
        <div><span>Time</span><strong>{booking.booking_time || "—"}</strong></div>
        <div><span>Address</span><strong>{booking.address || "—"}</strong></div>
      </div>
    </article>
  );
}