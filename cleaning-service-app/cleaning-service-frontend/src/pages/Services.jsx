import { useEffect, useState } from "react";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/services");
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setServices(data);
    } catch {
      setError("We could not load services. Please make sure the backend is running.");
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