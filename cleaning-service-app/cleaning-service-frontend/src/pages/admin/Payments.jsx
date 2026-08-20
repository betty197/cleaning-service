import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await api.get("/payments");
      setPayments(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch { setError("Could not load payments."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading"><div><span className="eyebrow">Administration</span><h1>Payments</h1><p>Review payment records returned by the backend.</p></div></div>
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} onRetry={load} />
        {!loading && <div className="table-card"><div className="table-scroll"><table><thead><tr><th>ID</th><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th><th>Payment Date</th></tr></thead><tbody>
          {payments.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.booking_id}</td><td>{item.amount ?? "—"} ETB</td><td>{item.payment_method || "—"}</td><td><StatusBadge status={item.payment_status} /></td><td>{item.payment_date || "—"}</td></tr>)}
        </tbody></table></div>{payments.length === 0 && <div className="empty-inline">No payment records found.</div>}</div>}
      </div>
    </section>
  );
}