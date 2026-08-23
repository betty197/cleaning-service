import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: ""
  });

  const userId = user?.id || user?.user_id;

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/${userId}`);
        const data = response.data?.data || response.data;
        setProfile(data);
      } catch {
        setError("Could not load your profile from the backend.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const openEdit = () => {
    setEditForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      address: profile?.address || ""
    });
    setEditOpen(true);
    setError("");
    setSuccess("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await api.put(`/users/${userId}`, {
        ...profile,
        full_name: editForm.full_name,
        phone: editForm.phone,
        address: editForm.address
      });
      const updated = response.data?.user || response.data?.data || { ...profile, ...editForm };
      setProfile(updated);
      updateUserProfile(updated);
      setSuccess("Profile updated successfully!");
      setEditOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container narrow-container">
        <div className="page-heading center">
          <span className="eyebrow">Account</span>
          <h1>My Profile</h1>
          <p>Your CleanPro customer information stored in the backend.</p>
        </div>

        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {profile && !loading && (
          <div className="profile-card">
            <div className="profile-avatar">{String(profile.full_name || "C").charAt(0).toUpperCase()}</div>
            <h2>{profile.full_name || "Customer"}</h2>
            <div className="profile-list">
              <div><span>Email</span><strong>{profile.email || "—"}</strong></div>
              <div><span>Phone</span><strong>{profile.phone || "—"}</strong></div>
              <div><span>Address</span><strong>{profile.address || "—"}</strong></div>
              <div><span>Role</span><strong style={{ textTransform: "capitalize" }}>{profile.role || "customer"}</strong></div>
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button type="button" className="btn btn-secondary" onClick={openEdit}>
                Edit Profile Details
              </button>
            </div>
          </div>
        )}

        <Modal open={editOpen} title="Edit Profile Details" onClose={() => setEditOpen(false)}>
          <form className="form-grid" onSubmit={saveEdit}>
            <FormInput
              label="Full Name"
              name="full_name"
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="+251..."
            />
            <label className="form-field full-span">
              <span>Default Address</span>
              <textarea
                rows="3"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="Street address, subcity, house number"
              />
            </label>
            <button className="btn btn-primary full-span" disabled={saving} type="submit">
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
}