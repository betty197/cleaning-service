import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/${user.id}`);
        setProfile(response.data?.data || response.data);
      } catch {
        setError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  return (
    <section className="page-section">
      <div className="container narrow-container">
        <div className="page-heading center"><span className="eyebrow">Account</span><h1>My Profile</h1><p>Your customer information from the backend.</p></div>
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} />
        {profile && !loading && (
          <div className="profile-card">
            <div className="profile-avatar">{String(profile.full_name || "C").charAt(0).toUpperCase()}</div>
            <h2>{profile.full_name || "Customer"}</h2>
            <div className="profile-list">
              <div><span>Email</span><strong>{profile.email || "—"}</strong></div>
              <div><span>Phone</span><strong>{profile.phone || "—"}</strong></div>
              <div><span>Address</span><strong>{profile.address || "—"}</strong></div>
              <div><span>Role</span><strong>{profile.role || "customer"}</strong></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}