import StatusBadge from "./StatusBadge";
import { getServiceImage } from "../utils/serviceImages";

export default function BookingCard({ booking, service, serviceName, onPay }) {
  const bookingId = booking.id || booking.booking_id;
  const isPaid = booking.payment_status === "Completed";
  const price = booking.service_price || booking.payment_amount;
  const serviceObj = service || {
    service_name: serviceName || booking.service_name,
    id: booking.service_id,
    image: booking.service_image || booking.image
  };
  const imgUrl = getServiceImage(serviceObj);

  return (
    <article className="booking-card">
      <div className="booking-card-top-row">
        <div className="booking-thumb">
          <img src={imgUrl} alt={serviceName || "Cleaning service"} loading="lazy" />
        </div>
        <div className="booking-card-main-info">
          <div className="booking-card-head">
            <div>
              <span className="eyebrow">Booking #{bookingId}</span>
              <h3>{serviceName || `Service #${booking.service_id}`}</h3>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <StatusBadge status={booking.status} />
              {isPaid ? (
                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "#dcfce7", color: "#166534", fontWeight: 600 }}>
                  Paid ({booking.payment_method || "Online"})
                </span>
              ) : (
                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "#fef3c7", color: "#92400e", fontWeight: 600 }}>
                  Unpaid
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="booking-details">
        <div><span>Date</span><strong>{booking.booking_date || "—"}</strong></div>
        <div><span>Time</span><strong>{booking.booking_time || "—"}</strong></div>
        <div><span>Address</span><strong>{booking.address || "—"}</strong></div>
        {price && <div><span>Price</span><strong>{price} ETB</strong></div>}
      </div>
      {!isPaid && onPay && (
        <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
          <button
            type="button"
            className="btn btn-primary btn-sm btn-full"
            onClick={() => onPay(booking)}
          >
            💳 Pay Now ({price ? `${price} ETB` : "Select Method"})
          </button>
        </div>
      )}
    </article>
  );
}