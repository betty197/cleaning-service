import { useState } from "react";
import { Link } from "react-router-dom";
import { getServiceImage } from "../utils/serviceImages";

export default function ServiceCard({ service }) {
  const defaultImage = getServiceImage(service);
  const [imgSrc, setImgSrc] = useState(defaultImage);

  return (
    <article className="service-card">
      <div className="service-card-image-wrap">
        <img
          src={imgSrc}
          alt={service.service_name || "Cleaning service"}
          onError={() => setImgSrc(defaultImage)}
          loading="lazy"
        />
      </div>
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
        <Link className="btn btn-primary btn-full" to={`/booking?service=${service.id || service.service_id}`}>
          Book Now
        </Link>
      </div>
    </article>
  );
}