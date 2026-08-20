import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, services: 0, bookings: 0, payments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [users, services, bookings, payments] = await Promise.all([
          api.get("/users"), api.get("/services"), api.get("/bookings"), api.get("/payments")
        ]);
        const list = (response) => Array.isArray(response.data) ? response.data : response.data?.data || [];
        setStats({ users: list(users).length, services: list(services).length, bookings: list(bookings).length, payments: list(payments).length });
      } catch {
        setError("Could not load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    ["Total Users", stats.users, "/admin/users"],
    ["Total Services", stats.services, "/admin/services"],
    ["Total Bookings", stats.bookings, "/admin/bookings"],
    ["Total Payments", stats.payments, "/admin/payments"]
  ];

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading"><div><span className="eyebrow">Administration</span><h1>Dashboard</h1><p>Overview of the CleanPro management system.</p></div></div>
        {loading && <LoadingSpinner text="Loading statistics..." />}
        <ErrorMessage message={error} />
        <div className="stat-grid">
          {cards.map(([label, value, link]) => <Link className="stat-card" to={link} key={label}><span>{label}</span><strong>{value}</strong><small>Manage →</small></Link>)}
        </div>
        <div className="admin-links">
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/services">Manage Services</Link>
          <Link to="/admin/bookings">Manage Bookings</Link>
          <Link to="/admin/payments">View Payments</Link>
        </div>
      </div>
    </section>
  );
}