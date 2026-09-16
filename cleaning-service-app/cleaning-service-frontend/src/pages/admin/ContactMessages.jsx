import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";

const emptyReply = { status: "New", admin_reply: "" };

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyForm, setReplyForm] = useState(emptyReply);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/contact");
      setMessages(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openMessage = (item) => {
    setSelected(item);
    setReplyForm({
      status: item.status || "New",
      admin_reply: item.admin_reply || ""
    });
    setSuccess("");
  };

  const saveReply = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.put(`/contact/${selected.id}`, replyForm);
      const updated = response.data?.data || { ...selected, ...replyForm };
      setMessages((items) => items.map((item) => item.id === selected.id ? updated : item));
      setSelected(updated);
      setSuccess("Message updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Message could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this contact message? This cannot be undone.")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((items) => items.filter((item) => item.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Message could not be deleted.");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Administration</span>
            <h1>Contact Messages</h1>
            <p>Read customer inquiries and send replies from the admin inbox.</p>
          </div>
        </div>

        {loading && <LoadingSpinner text="Loading contact messages..." />}
        <ErrorMessage message={error} onRetry={load} />
        <SuccessMessage message={success} />

        {!loading && (
          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((item) => (
                    <tr key={item.id}>
                      <td>{item.created_at || "—"}</td>
                      <td>
                        <strong>{item.name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.email}</div>
                      </td>
                      <td>{item.subject || "No subject"}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>
                        <div className="table-actions">
                          <button type="button" onClick={() => openMessage(item)}>View / Reply</button>
                          <button type="button" className="danger-text" onClick={() => remove(item.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {messages.length === 0 && <div className="empty-inline">No contact messages found.</div>}
          </div>
        )}

        <Modal
          open={Boolean(selected)}
          title={selected ? selected.subject || "Contact message" : "Contact message"}
          onClose={() => setSelected(null)}
        >
          {selected && (
            <>
              <div className="detail-list">
                <div><span>From</span><strong>{selected.name}</strong></div>
                <div><span>Email</span><strong>{selected.email}</strong></div>
                <div><span>Phone</span><strong>{selected.phone || "—"}</strong></div>
                <div><span>Received</span><strong>{selected.created_at || "—"}</strong></div>
              </div>
              <div style={{ margin: "1.25rem 0", padding: "1rem", background: "#f8fafc", borderRadius: "8px", whiteSpace: "pre-wrap" }}>
                {selected.message}
              </div>
              <form className="form-grid" onSubmit={saveReply}>
                <label className="form-field">
                  <span>Status</span>
                  <select value={replyForm.status} onChange={(event) => setReplyForm({ ...replyForm, status: event.target.value })}>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>
                <label className="form-field full-span">
                  <span>Reply</span>
                  <textarea
                    rows="5"
                    value={replyForm.admin_reply}
                    onChange={(event) => setReplyForm({ ...replyForm, admin_reply: event.target.value })}
                    placeholder="Write a reply for the customer..."
                  />
                </label>
                <button className="btn btn-primary full-span" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Reply"}
                </button>
              </form>
            </>
          )}
        </Modal>
      </div>
    </section>
  );
}
