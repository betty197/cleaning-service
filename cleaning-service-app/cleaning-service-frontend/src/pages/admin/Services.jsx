import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";
import { SERVICE_IMAGE_PRESETS, getServiceImage } from "../../utils/serviceImages";

const emptyForm = { service_name: "", description: "", price: "", duration_hours: "", image: "", status: "Active" };

export default function Services() {
  const { searchQuery } = useOutletContext() || {};
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/services");
      setServices(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch {
      setError("Could not load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filtered services via global search
  const filteredServices = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        (s.service_name || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q) ||
        (s.status || "").toLowerCase().includes(q)
    );
  }, [services, searchQuery]);

  // Pagination
  const totalRecords = filteredServices.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, currentPage, pageSize]);

  // Validations
  const validateForm = () => {
    setValidationError("");
    if (!form.service_name || form.service_name.trim().length < 2) {
      setValidationError("Service Name is required (at least 2 characters).");
      return false;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      setValidationError("Price must be a valid positive number.");
      return false;
    }
    return true;
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setValidationError("");
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setValidationError("");
    setForm({
      service_name: item.service_name || "",
      description: item.description || "",
      price: item.price ?? "",
      duration_hours: item.duration_hours ?? item.duration ?? "",
      image: item.image || "",
      status: item.status || "Active"
    });
    setOpen(true);
  };

  const applyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      service_name: prev.service_name || preset.name,
      description: prev.description || preset.description,
      image: preset.image
    }));
  };

  const saveService = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    const payload = {
      service_name: form.service_name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration_hours: form.duration_hours ? Number(form.duration_hours) : 0,
      image: form.image.trim(),
      status: form.status
    };

    try {
      let saved;
      if (editing?.id) {
        const response = await api.put(`/services/${editing.id}`, payload);
        saved = response.data?.service || response.data?.data || { ...editing, ...payload };
        setServices((items) => items.map((item) => (item.id === editing.id ? saved : item)));
      } else {
        const response = await api.post("/services", payload);
        saved = response.data?.service || response.data?.data || { id: Date.now(), ...payload };
        setServices((items) => [...items, saved]);
      }
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save service.");
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (id) => {
    if (!window.confirm("Delete this service catalog item?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((items) => items.filter((item) => item.id !== id));
    } catch {
      setError("Service could not be deleted.");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">CATALOG MANAGEMENT</span>
            <h1>Manage Services</h1>
            <p>Create, update, and manage cleaning service catalog offerings, images, and pricing.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            ➕ Add Service
          </button>
        </div>

        {loading && <LoadingSpinner text="Loading service catalog..." />}
        <ErrorMessage message={error} />

        {!loading && (
          <>
            <div className="admin-service-grid">
              {paginatedServices.length === 0 ? (
                <div className="empty-catalog text-center py-4">No services found matching search.</div>
              ) : (
                paginatedServices.map((item) => (
                  <div className="admin-service-card" key={item.id}>
                    <div className="service-card-image-wrap">
                      <img
                        src={getServiceImage(item)}
                        alt={item.service_name}
                        className="service-card-img"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <span className={`status-pill ${item.status === "Active" ? "pill-emerald" : "pill-gray"}`}>
                        {item.status || "Active"}
                      </span>
                    </div>

                    <div className="service-card-body">
                      <h3>{item.service_name}</h3>
                      <p>{item.description}</p>
                      <div className="admin-service-meta">
                        <strong>${Number(item.price || 0).toFixed(2)}</strong>
                        <span>⏱️ {item.duration_hours || item.duration || 2} hrs</span>
                      </div>
                      <div className="table-actions margin-top-12">
                        <button type="button" className="btn-action edit" onClick={() => openEdit(item)}>
                          Edit
                        </button>
                        <button type="button" className="btn-action delete" onClick={() => removeService(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-bar margin-top-24">
              <div className="pagination-info">
                Showing {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} services
              </div>
              <div className="pagination-controls">
                <label>
                  Page Size:
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
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
          </>
        )}
      </div>

      {/* Modal: Service Editor */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? `Edit Service #${editing.id}` : "Create New Cleaning Service"}
      >
        <form onSubmit={saveService} className="modal-form">
          {validationError && (
            <div className="validation-error-box">
              ⚠️ {validationError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="service_name">Service Name *</label>
            <input
              type="text"
              id="service_name"
              value={form.service_name}
              onChange={(e) => setForm({ ...form, service_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                id="price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration_hours">Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                id="duration_hours"
                value={form.duration_hours}
                onChange={(e) => setForm({ ...form, duration_hours: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Service"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}