import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";

const emptyForm = { service_name: "", description: "", price: "", duration_hours: "", image: "", status: "" };

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await api.get("/services");
      setServices(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch { setError("Could not load services."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      service_name: item.service_name || "",
      description: item.description || "",
      price: item.price ?? "",
      duration_hours: item.duration_hours ?? "",
      image: item.image || "",
      status: item.status || ""
    });
    setOpen(true);
  };

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const payload = {
        service_name: form.service_name,
        description: form.description,
        price: form.price === "" ? "" : Number(form.price),
        duration_hours: form.duration_hours === "" ? "" : Number(form.duration_hours),
        image: form.image,
        status: form.status
      };
      if (editing) {
        const response = await api.put(`/services/${editing.id}`, payload);
        const updated = response.data?.data || response.data;
        setServices((items) => items.map((item) => item.id === editing.id ? updated : item));
      } else {
        const response = await api.post("/services", payload);
        const created = response.data?.data || response.data;
        setServices((items) => [...items, created]);
      }
      setOpen(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Service could not be saved.");
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try { await api.delete(`/services/${id}`); setServices((items) => items.filter((item) => item.id !== id)); }
    catch { setError("Service could not be deleted."); }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading"><div><span className="eyebrow">Administration</span><h1>Services</h1><p>Create and maintain the cleaning services in your database.</p></div><button className="btn btn-primary" onClick={openCreate}>+ Add Service</button></div>
        <ErrorMessage message={error} onRetry={load} />
        {loading && <LoadingSpinner />}
        {!loading && <div className="admin-service-grid">{services.map((item) => <div className="admin-service-card" key={item.id}><div><span className="eyebrow">#{item.id}</span><h3>{item.service_name}</h3><p>{item.description || "No description"}</p></div><div className="service-meta"><strong>{item.price ?? "—"} ETB</strong><span>{item.duration_hours ?? "—"} hour(s)</span></div><div className="table-actions"><button onClick={() => openEdit(item)}>Edit</button><button className="danger-text" onClick={() => remove(item.id)}>Delete</button></div></div>)}</div>}
        <Modal open={open} title={editing ? "Edit service" : "Add service"} onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label className="form-field full-span"><span>Service name</span><input required value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} /></label>
            <label className="form-field full-span"><span>Description</span><textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="form-field"><span>Price</span><input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
            <label className="form-field"><span>Duration (hours)</span><input type="number" min="0" step="0.1" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} /></label>
            <label className="form-field full-span"><span>Image URL</span><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
            <label className="form-field full-span"><span>Status</span><input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Active / Inactive" /></label>
            <button className="btn btn-primary full-span" disabled={saving}>{saving ? "Saving..." : "Save Service"}</button>
          </form>
        </Modal>
      </div>
    </section>
  );
}