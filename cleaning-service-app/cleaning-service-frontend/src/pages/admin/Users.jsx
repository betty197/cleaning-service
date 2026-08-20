import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";

const emptyForm = { full_name: "", email: "", phone: "", password: "", address: "", role: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      setUsers(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((items) => items.filter((item) => item.id !== id));
    } catch {
      setError("User could not be deleted.");
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      full_name: item.full_name || "",
      email: item.email || "",
      phone: item.phone || "",
      password: "",
      address: item.address || "",
      role: item.role || ""
    });
    setEditOpen(true);
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        role: form.role
      };

      // Only send password when the admin actually entered a new one.
      if (form.password) payload.password = form.password;

      const response = await api.put(`/users/${editing.id}`, payload);
      const updated = response.data?.data || response.data;

      setUsers((items) =>
        items.map((item) => item.id === editing.id ? updated : item)
      );
      setEditOpen(false);
      setEditing(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "User could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Administration</span>
            <h1>Users</h1>
            <p>Manage customer and administrator accounts.</p>
          </div>
        </div>

        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} onRetry={load} />

        {!loading && (
          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.full_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone || "—"}</td>
                      <td><span className="role-pill">{item.role || "customer"}</span></td>
                      <td>
                        <div className="table-actions">
                          <button type="button" onClick={() => setSelected(item)}>View</button>
                          <button type="button" onClick={() => openEdit(item)}>Edit</button>
                          <button type="button" className="danger-text" onClick={() => remove(item.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <div className="empty-inline">No users found.</div>}
          </div>
        )}

        <Modal open={Boolean(selected)} title="User details" onClose={() => setSelected(null)}>
          {selected && (
            <div className="detail-list">
              <div><span>ID</span><strong>{selected.id}</strong></div>
              <div><span>Name</span><strong>{selected.full_name}</strong></div>
              <div><span>Email</span><strong>{selected.email}</strong></div>
              <div><span>Phone</span><strong>{selected.phone || "—"}</strong></div>
              <div><span>Address</span><strong>{selected.address || "—"}</strong></div>
              <div><span>Role</span><strong>{selected.role || "—"}</strong></div>
            </div>
          )}
        </Modal>

        <Modal open={editOpen} title="Edit user" onClose={() => setEditOpen(false)}>
          <form className="form-grid" onSubmit={saveEdit}>
            <label className="form-field full-span">
              <span>Full name</span>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="form-field">
              <span>Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="form-field">
              <span>New password (optional)</span>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
            <label className="form-field">
              <span>Role</span>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </label>
            <label className="form-field full-span">
              <span>Address</span>
              <textarea rows="4" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </label>
            <button className="btn btn-primary full-span" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
}