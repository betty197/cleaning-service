import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import Modal from "./Modal";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const getCategory = () => {
    const path = location.pathname;
    if (path === "/admin/users") return "User Directory";
    if (path === "/admin/services") return "Service Catalog";
    if (path === "/admin/bookings") return "Scheduling & Dispatch";
    if (path === "/admin/payments") return "Financial Transactions";
    if (path === "/admin/contact-messages") return "Customer Inquiries";
    if (path === "/admin/cleaners") return "Cleaner Operations";
    if (path === "/admin/settings") return "System Configuration";
    if (path === "/admin/sessions") return "Session Monitor";
    return "Control Center";
  };

  return (
    <div className="admin-shell">
      {/* Mobile Top Navbar Bar */}
      <div className="admin-mobile-bar">
        <button
          className="admin-sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle Sidebar Navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className="admin-mobile-brand">
          <img src="/logo.png" alt="CleanPro Logo" className="brand-logo-img" />
          <span className="brand-text">Clean<span>Pro</span></span>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar} />}

      {/* Fixed Static Non-Scrollable Sidebar Construction */}
      <aside className={`admin-sidebar fixed-static-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-sidebar-brand" onClick={closeSidebar}>
            <div className="admin-logo-img-wrapper">
              <img src="/logo.png" alt="CleanPro Logo" className="official-website-logo" />
            </div>
            <div className="admin-brand-info">
              <span className="brand-name">Clean<span>Pro</span></span>
              <span className="brand-sub">Enterprise Portal</span>
            </div>
          </NavLink>
        </div>

        {/* Sidebar Profile Card REMOVED as requested to eliminate redundancy with Navbar */}

        {/* Compact Navigation Menu */}
        <nav className="admin-sidebar-nav compact-nav">
          <div className="nav-group-label">SYSTEM NAVIGATION</div>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/>
            </svg>
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="nav-label">Manage Users</span>
          </NavLink>

          <NavLink
            to="/admin/services"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span className="nav-label">Manage Services</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="nav-label">Manage Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span className="nav-label">View Payments</span>
          </NavLink>

          <NavLink
            to="/admin/contact-messages"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="nav-label">View Messages</span>
          </NavLink>

          <div className="nav-group-label">OPERATIONS</div>

          <NavLink
            to="/admin/cleaners"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span className="nav-label">Cleaner Operations</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg className="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span className="nav-label">Settings & Backup</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink
            to="/admin/sessions"
            className={({ isActive }) => `sidebar-utility-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M3 12h2m14 0h2"/>
            </svg>
            <span>Session monitor</span>
            <span className="session-live-dot" aria-label="Live" />
          </NavLink>
          <NavLink to="/" className="sidebar-utility-link" onClick={closeSidebar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>
            </svg>
            <span>Return to Home</span>
          </NavLink>
          <button
            type="button"
            className="sidebar-utility-link sidebar-logout-link"
            onClick={() => setLogoutModalOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="admin-main-wrapper">
        {/* Persistent Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <span className="topbar-category">{getCategory()}</span>
            <h2 className="topbar-title">Control Center</h2>
          </div>

          {/* Global Search Bar */}
          <div className="topbar-center">
            <div className="global-search-wrapper">
              <svg className="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search records, users, bookings..."
                className="global-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="search-clear-btn" onClick={() => setSearchQuery("")}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Topbar Right Controls & Refined Top-Right Logout */}
          <div className="topbar-right">
            {/* Real-time Notifications Bell */}
            <div className="notif-dropdown-wrapper">
              <button
                type="button"
                className="topbar-notif-btn"
                onClick={() => {
                  setNotifOpen((prev) => !prev);
                  markAllAsRead();
                }}
                title="System Activity & Change Log"
              >
                <svg className="notif-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {notifOpen && (
                <div className="notif-dropdown-panel">
                  <div className="notif-panel-header">
                    <strong>Activity Feed</strong>
                    <span className="notif-count">{notifications.length} Logged Events</span>
                  </div>
                  <div className="notif-panel-list">
                    {notifications.map((item) => (
                      <div className="notif-item" key={item.id}>
                        <div className="notif-info">
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                          <small>{item.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="topbar-theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>
                </svg>
              )}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* Clean User Profile Badge Display */}
            <NavLink to="/admin/settings" className="topbar-user-badge">
              <img src="/logo.png" alt={user?.full_name || "User Avatar"} className="topbar-avatar-img" />
              <div className="topbar-user-info">
                <span className="topbar-username">{user?.full_name || "Executive User"}</span>
                <span className="topbar-useremail">{user?.email || "admin@cleanpro.com"}</span>
              </div>
            </NavLink>

          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="admin-content-area">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>

      {/* Premium Custom Logout Confirmation Modal */}
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Sign Out"
      >
        <div className="logout-modal-content">
          <p className="logout-modal-text">
            Are you sure you want to end your current session and sign out of the CleanPro Control Center?
          </p>
          <div className="logout-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
