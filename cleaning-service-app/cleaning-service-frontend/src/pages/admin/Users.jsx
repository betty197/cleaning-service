import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";

const emptyForm = { full_name: "", email: "", phone: "", password: "", address: "", role: "customer" };

export default function Users() {
  const { searchQuery } = useOutletContext() || {};
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const uRes = await api.get("/users");
      setUsers(Array.isArray(uRes.data) ? uRes.data : uRes.data?.data || []);
    } catch {
      setError("Could not load users database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter the directory through the global search.
  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.full_name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.phone || "").toLowerCase().includes(q) ||
          (u.role || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [users, searchQuery]);

  // Table Pagination
  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Strict Client-Side Input Validations
  const validateForm = () => {
    setValidationError("");

    if (!form.full_name || form.full_name.trim().length < 2) {
      setValidationError("Full name is required (at least 2 characters).");
      return false;
    }

    // Strict Email validation requirement: MUST contain '@' and valid domain
    if (!form.email || !form.email.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setValidationError("Invalid Email address! Submission rejected: Email must contain '@' and a valid domain.");
      return false;
    }

    return true;
  };

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
    setValidationError("");
    setForm({
      full_name: item.full_name || "",
      email: item.email || "",
      phone: item.phone || "",
      password: "",
      address: item.address || "",
      role: item.role || "customer"
    });
    setEditOpen(true);
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      let updatedUser;
      if (editing?.id) {
        const response = await api.put(`/users/${editing.id}`, payload);
        updatedUser = response.data?.user || response.data?.data || { ...editing, ...payload };
        setUsers((items) => items.map((item) => (item.id === editing.id ? updatedUser : item)));
      } else {
        const response = await api.post("/users", payload);
        updatedUser = response.data?.user || response.data?.data || { id: Date.now(), ...payload };
        setUsers((items) => [...items, updatedUser]);
      }

      setEditOpen(false);
      setEditing(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">USER DIRECTORY</span>
            <h1>Manage Users</h1>
            <p>Maintain account access, roles, and contact details across your customer directory.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setValidationError("");
              setEditOpen(true);
            }}
          >
            ➕ Add New User
          </button>
        </div>

        {loading && <LoadingSpinner text="Loading user directory..." />}
        <ErrorMessage message={error} />

        {!loading && (
          <div className="data-table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User Details</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No user records match your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((item) => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>
                          <strong>{item.full_name}</strong>
                          <div className="text-muted text-sm">{item.email}</div>
                          {item.phone && <small className="text-muted">{item.phone}</small>}
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              item.role === "admin"
                                ? "pill-blue"
                                : item.role === "cleaner"
                                ? "pill-emerald"
                                : "pill-gray"
                            }`}
                          >
                            {item.role}
                          </span>
                        </td>
                        <td>{item.address || "N/A"}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn-action edit"
                              onClick={() => openEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn-action delete"
                              onClick={() => remove(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Bar */}
            <div className="pagination-bar">
              <div className="pagination-info">
                Showing {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} user accounts
              </div>
              <div className="pagination-controls">
                <label>
                  Rows:
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="btn-page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ◀ Prev
                </button>
                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn-page"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title={editing ? `Edit User #${editing.id}` : "Create New User"}
      >
        <form onSubmit={saveEdit} className="modal-form">
          {validationError && (
            <div className="validation-error-box">
              ⚠️ {validationError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address * (Strict Validation)</label>
            <input
              type="text"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="must contain @"
              required
            />
            <small className="help-text">Submissions without an @ symbol are rejected.</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Role</label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="cleaner">Cleaner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {editing ? "New Password (leave blank to keep current)" : "Password *"}
            </label>
<<<<<<< Updated upstream
            <label className="form-field">
              <span>Email</span>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="form-field">
              <span>Phone</span>
              <input type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" title="Enter exactly 10 digits" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
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
=======
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editing}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditOpen(false)}
            >
              Cancel
>>>>>>> Stashed changes
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}