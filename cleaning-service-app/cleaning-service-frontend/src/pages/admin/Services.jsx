import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";
import { SERVICE_IMAGE_PRESETS, getServiceImage } from "../../utils/serviceImages";

const emptyForm = { service_name: "", description: "", price: "", duration_hours: "", image: "", status: "Active" };

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
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

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        service_name: form.service_name,
        description: form.description,
        price: form.price === "" ? 0 : Number(form.price),
        duration: `${form.duration_hours || 2} hours`,
        duration_hours: form.duration_hours === "" ? 2 : Number(form.duration_hours),
        image: form.image || getServiceImage(form),
        status: form.status || "Active"
      };

      const serviceId = editing?.id || editing?.service_id;
      if (editing && serviceId) {
        const response = await api.put(`/services/${serviceId}`, payload);
        const updated = response.data?.service || response.data?.data || { ...editing, ...payload };
        setServices((items) =>
          items.map((item) => ((item.id || item.service_id) === serviceId ? { ...item, ...updated } : item))
        );
      } else {
        const response = await api.post("/services", payload);
        const created = response.data?.service || response.data?.data || response.data;
        setServices((items) => [...items, created]);
      }
      setOpen(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Service could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    const serviceId = item.id || item.service_id;
    if (!window.confirm(`Delete service "${item.service_name}"?`)) return;
    try {
      await api.delete(`/services/${serviceId}`);
      setServices((items) => items.filter((s) => (s.id || s.service_id) !== serviceId));
    } catch {
      setError("Service could not be deleted.");
    }
  };

  const previewImg = form.image || getServiceImage(form);

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Administration</span>
            <h1>Services</h1>
            <p>Create and maintain the cleaning services in your database.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            + Add Service
          </button>
        </div>

        <ErrorMessage message={error} onRetry={load} />
        {loading && <LoadingSpinner text="Loading services..." />}

        {!loading && (
          <div className="admin-service-grid">
            {services.map((item) => {
              const serviceId = item.id || item.service_id;
              const cardImg = getServiceImage(item);
              return (
                <div className="admin-service-card" key={serviceId}>
                  <div className="admin-service-thumb">
                    <img src={cardImg} alt={item.service_name} loading="lazy" />
                  </div>
                  <div>
                    <span className="eyebrow">#{serviceId}</span>
                    <h3>{item.service_name}</h3>
                    <p>{item.description || "No description provided."}</p>
                  </div>
                  <div className="service-meta">
                    <strong>{item.price ?? "—"} ETB</strong>
                    <span>{item.duration_hours || item.duration || "—"} hrs</span>
                  </div>
                  <div className="table-actions">
                    <button onClick={() => openEdit(item)}>Edit</button>
                    <button className="danger-text" onClick={() => remove(item)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal open={open} title={editing ? "Edit Service" : "Add Service"} onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <div className="full-span">
              <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#34445b", display: "block", marginBottom: "0.5rem" }}>
                Quick Image & Category Presets
              </span>
              <div className="preset-chip-list">
                {SERVICE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="preset-chip"
                    onClick={() => applyPreset(preset)}
                    title={preset.description}
                  >
                    <img src={preset.image} alt={preset.name} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="form-field full-span">
              <span>Service name</span>
              <input
                required
                value={form.service_name}
                onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                placeholder="e.g. Deep Cleaning Service"
              />
            </label>
            <label className="form-field full-span">
              <span>Description</span>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what is included in this cleaning service"
              />
            </label>
            <label className="form-field">
              <span>Price (ETB)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </label>
            <label className="form-field">
              <span>Duration (hours)</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.duration_hours}
                onChange={(e) => setForm({ ...form, duration_hours: e.target.value })}
                placeholder="e.g. 3"
              />
            </label>
            <label className="form-field full-span">
              <span>Image URL (or select preset above)</span>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </label>

            {previewImg && (
              <div className="full-span form-image-preview">
                <span>Selected Image Preview:</span>
                <img src={previewImg} alt="Preview" />
              </div>
            )}

            <label className="form-field full-span">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <button className="btn btn-primary full-span" disabled={saving}>
              {saving ? "Saving Service..." : "Save Service"}
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
}