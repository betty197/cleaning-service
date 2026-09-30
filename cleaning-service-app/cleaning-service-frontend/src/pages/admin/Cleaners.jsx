import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Modal from "../../components/Modal";

const INITIAL_CLEANERS = [
  { id: 1, full_name: "Dawit Worku", email: "dawit.w@cleanpro.com", phone: "+251 911 234 567", status: "On Job", rating: 4.9, completed_jobs: 48, active_job: "Booking #1 - Home Deep Clean", priority: 1 },
  { id: 2, full_name: "Tigist Alemu", email: "tigist.a@cleanpro.com", phone: "+251 922 345 678", status: "Available", rating: 4.8, completed_jobs: 35, active_job: "None", priority: 2 },
  { id: 3, full_name: "Samuel Tadesse", email: "samuel.t@cleanpro.com", phone: "+251 933 456 789", status: "Available", rating: 4.95, completed_jobs: 62, active_job: "None", priority: 3 },
  { id: 4, full_name: "Marta Haile", email: "marta.h@cleanpro.com", phone: "+251 944 567 890", status: "Off Duty", rating: 4.7, completed_jobs: 29, active_job: "None", priority: 4 },
  { id: 5, full_name: "Solomon Kebede", email: "solomon.k@cleanpro.com", phone: "+251 955 678 901", status: "On Job", rating: 5.0, completed_jobs: 84, active_job: "Booking #2 - Office Sanitization", priority: 5 }
];

const emptyForm = { full_name: "", email: "", phone: "", status: "Available", rating: "5.0", priority: 1 };

export default function Cleaners() {
  const { searchQuery } = useOutletContext() || {};
  const [cleaners, setCleaners] = useState(() => {
    try {
      const saved = localStorage.getItem("cleanpro_cleaners");
      return saved ? JSON.parse(saved) : INITIAL_CLEANERS;
    } catch {
      return INITIAL_CLEANERS;
    }
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    localStorage.setItem("cleanpro_cleaners", JSON.stringify(cleaners));
  }, [cleaners]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } catch {
        // use fallback if backend unavailable
      }
    };
    fetchBookings();
  }, []);

  // Global search filtering
  const filteredCleaners = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return cleaners;
    const q = searchQuery.toLowerCase().trim();
    return cleaners.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [cleaners, searchQuery]);

  // Pagination calculations
  const totalRecords = filteredCleaners.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedCleaners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCleaners.slice(start, start + pageSize);
  }, [filteredCleaners, currentPage, pageSize]);

  // Strict Client-Side Input Validations
  const validateForm = () => {
    setValidationError("");

    if (!form.full_name || form.full_name.trim().length < 3) {
      setValidationError("Full Name must be at least 3 characters long.");
      return false;
    }

    // Strict Email validation requirement: MUST contain '@' and valid domain
    if (!form.email || !form.email.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setValidationError("Invalid Email address! Submission rejected: Email must contain '@' and a valid domain.");
      return false;
    }

    if (!form.phone || form.phone.trim().length < 7) {
      setValidationError("Valid phone number is required.");
      return false;
    }

    return true;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCleaner = {
      id: Date.now(),
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
      rating: parseFloat(form.rating) || 5.0,
      completed_jobs: 0,
      active_job: "None",
      priority: cleaners.length + 1
    };

    setCleaners((prev) => [...prev, newCleaner]);
    setModalOpen(false);
    setForm(emptyForm);
    setValidationError("");
  };

  const toggleCleanerStatus = (id, newStatus) => {
    setCleaners((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const movePriority = (id, direction) => {
    setCleaners((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">OPERATIONS</span>
            <h1>Cleaner Tracking & Job Management</h1>
            <p>Monitor cleaner roster, job order priorities, real-time status, and active task assignments.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setForm(emptyForm);
              setValidationError("");
              setModalOpen(true);
            }}
          >
            ➕ Register New Cleaner
          </button>
        </div>

        <ErrorMessage message={error} />

        {/* Cleaner Summary Badges */}
        <div className="stat-cards-grid margin-bottom-24">
          <div className="stat-card-vibrant card-blue">
            <div className="stat-card-header">
              <span className="stat-icon">🧽</span>
              <span className="stat-tag">Total Cleaners</span>
            </div>
            <div className="stat-value">{cleaners.length}</div>
          </div>
          <div className="stat-card-vibrant card-emerald">
            <div className="stat-card-header">
              <span className="stat-icon">🟢</span>
              <span className="stat-tag">Available Now</span>
            </div>
            <div className="stat-value">
              {cleaners.filter((c) => c.status === "Available").length}
            </div>
          </div>
          <div className="stat-card-vibrant card-amber">
            <div className="stat-card-header">
              <span className="stat-icon">🧹</span>
              <span className="stat-tag">On Active Job</span>
            </div>
            <div className="stat-value">
              {cleaners.filter((c) => c.status === "On Job").length}
            </div>
          </div>
        </div>

        {/* Cleaners Data Table Card */}
        <div className="data-table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank / Priority</th>
                  <th>Cleaner Name</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Completed Jobs</th>
                  <th>Active Assigned Job</th>
                  <th>Priority Reorder</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCleaners.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No cleaner records found.
                    </td>
                  </tr>
                ) : (
                  paginatedCleaners.map((cleaner, index) => (
                    <tr key={cleaner.id}>
                      <td>
                        <span className="badge-rank">#{index + 1 + (currentPage - 1) * pageSize}</span>
                      </td>
                      <td>
                        <strong>{cleaner.full_name}</strong>
                      </td>
                      <td>
                        <div>{cleaner.email}</div>
                        <small className="text-muted">{cleaner.phone}</small>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            cleaner.status === "Available"
                              ? "pill-emerald"
                              : cleaner.status === "On Job"
                              ? "pill-blue"
                              : "pill-gray"
                          }`}
                        >
                          {cleaner.status}
                        </span>
                      </td>
                      <td>⭐ {cleaner.rating}</td>
                      <td>{cleaner.completed_jobs} jobs</td>
                      <td>
                        <span className="active-job-tag">{cleaner.active_job}</span>
                      </td>
                      <td>
                        <div className="priority-actions">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => movePriority(cleaner.id, "up")}
                            title="Move Up Priority"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => movePriority(cleaner.id, "down")}
                            title="Move Down Priority"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td>
                        <select
                          className="status-select-sm"
                          value={cleaner.status}
                          onChange={(e) => toggleCleanerStatus(cleaner.id, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="On Job">On Job</option>
                          <option value="Off Duty">Off Duty</option>
                        </select>
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
              {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} cleaners
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
      </div>

      {/* Modal: Register New Cleaner */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Cleaner"
      >
        <form onSubmit={handleSave} className="modal-form">
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
              placeholder="e.g. Samuel Tadesse"
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
              placeholder="cleaner@cleanpro.com (must contain @)"
              required
            />
            <small className="help-text">Client-side validation rejects submissions missing the @ symbol.</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="text"
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+251 911 000 000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Initial Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="On Job">On Job</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Cleaner
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
