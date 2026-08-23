import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/payments");
      setPayments(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch {
      setError("Could not load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (payment, status) => {
    const paymentId = payment.id || payment.payment_id;
    setSavingId(paymentId);
    setError("");
    try {
      await api.put(`/payments/${paymentId}`, { payment_status: status });
      setPayments((items) =>
        items.map((item) =>
          (item.id || item.payment_id) === paymentId ? { ...item, payment_status: status } : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Payment status could not be updated.");
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this payment record? This cannot be undone.")) return;
    try {
      await api.delete(`/payments/${id}`);
      setPayments((items) => items.filter((item) => (item.id || item.payment_id) !== id));
    } catch {
      setError("Payment record could not be deleted.");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Administration</span>
            <h1>Payments</h1>
            <p>Review customer transactions, payment methods, and reconcile balances.</p>
          </div>
        </div>

        {loading && <LoadingSpinner text="Loading payment records..." />}
        <ErrorMessage message={error} onRetry={load} />

        {!loading && (
          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((item) => {
                    const paymentId = item.id || item.payment_id;
                    return (
                      <tr key={paymentId}>
                        <td><strong>#{paymentId}</strong></td>
                        <td>Booking #{item.booking_id} {item.service_name && `(${item.service_name})`}</td>
                        <td>{item.customer_name || "—"}</td>
                        <td><strong>{item.amount ?? "—"} ETB</strong></td>
                        <td>{item.payment_method || "Cash"}</td>
                        <td><StatusBadge status={item.payment_status} /></td>
                        <td>{item.payment_date || "—"}</td>
                        <td>
                          <div className="table-actions">
                            <select
                              disabled={savingId === paymentId}
                              value={item.payment_status || "Pending"}
                              onChange={(e) => updateStatus(item, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Completed">Completed</option>
                              <option value="Failed">Failed</option>
                            </select>
                            <button className="danger-text" onClick={() => remove(paymentId)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && <div className="empty-inline">No payment records found.</div>}
          </div>
        )}
      </div>
    </section>
  );
}