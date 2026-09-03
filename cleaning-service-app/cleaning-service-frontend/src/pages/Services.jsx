import { useEffect, useState } from "react";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const fallbackServices = [
  {
    id: 1,
    service_name: "Home Office Cleaning",
    description: "Dusting, sanitizing, and organizing your workspace for a productive, fresh environment.",
    price: 1200,
    duration_hours: 2,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    status: "Popular"
  },
  {
    id: 2,
    service_name: "Deep Cleaning",
    description: "A thorough, detailed cleaning for kitchens, bathrooms, floors, and hard-to-reach corners.",
    price: 1800,
    duration_hours: 3,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=80",
    status: "Top Rated"
  },
  {
    id: 3,
    service_name: "Home Cleaning",
    description: "Reliable everyday home care for living rooms, bedrooms, and common spaces.",
    price: 1500,
    duration_hours: 2,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    status: "Best Value"
  },
  {
    id: 4,
    service_name: "Office Cleaning",
    description: "Professional cleaning for desks, meeting areas, and shared office spaces.",
    price: 2000,
    duration_hours: 3,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    status: "Business"
  }
];

export default function Services() {
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/services");
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setServices(data.length > 0 ? data : fallbackServices);
    } catch {
      setServices(fallbackServices);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Our Services</span>
            <h1>Professional cleaning, made simple.</h1>
            <p>Choose from the cleaning services available in your CleanPro database.</p>
          </div>
        </div>
        {loading && <LoadingSpinner text="Loading services..." />}
        <ErrorMessage message={error} onRetry={loadServices} />
        {!loading && !error && services.length === 0 && (
          <div className="empty-state"><h3>No services available</h3><p>Add services from the admin service manager.</p></div>
        )}
        <div className="service-grid">
          {services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </div>
    </section>
  );
}