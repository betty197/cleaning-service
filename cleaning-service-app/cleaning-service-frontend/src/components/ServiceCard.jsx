import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  const image = service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="service-card">
      <img src={image} alt={service.service_name || "Cleaning service"} />
      <div className="service-card-body">
        <div className="service-card-top">
          <h3>{service.service_name || "Cleaning Service"}</h3>
          {service.status && <span className="mini-status">{service.status}</span>}
        </div>
        <p>{service.description || "Professional cleaning tailored to your space."}</p>
        <div className="service-meta">
          <strong>{service.price != null ? `${service.price} ETB` : "Price available on request"}</strong>
          {service.duration_hours != null && <span>{service.duration_hours} hour(s)</span>}
        </div>
        <Link className="btn btn-primary btn-full" to={`/booking?service=${service.id}`}>
          Book Now
        </Link>
      </div>
    </article>
  );
}