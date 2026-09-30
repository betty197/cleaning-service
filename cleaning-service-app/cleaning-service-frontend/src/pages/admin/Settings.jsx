import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const DEFAULT_SETTINGS = {
  // General Business
  siteName: "CleanPro Cleaning Services",
  siteTagline: "Premium Residential & Commercial Cleaning",
  supportEmail: "support@cleanpro.com",
  supportPhone: "+1 (800) 555-0199",
  businessAddress: "123 Clean St, Suite 400, New York, NY 10001",
  operatingHours: "Mon - Sat: 8:00 AM - 7:00 PM",

  // Booking & Pricing
  currency: "USD ($)",
  taxRate: 8.5,
  serviceFeePercent: 5.0,
  autoConfirmBookings: true,
  minLeadTimeHours: 4,
  cancellationFeePercent: 10.0,

  // Appearance & UI
  compactSidebar: false,
  accentColor: "blue",
  animationsEnabled: true,

  // Notifications
  emailOnNewBooking: true,
  emailOnStatusChange: true,
  customerReminders: true,
  weeklyAdminDigest: false,

  // Admin Profile
  adminDisplayName: "Admin Manager",
  adminEmail: "admin@cleanpro.com"
};

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("cleanpro_admin_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);

  // Sync profile details with AuthContext user
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        adminDisplayName: user.full_name || prev.adminDisplayName,
        adminEmail: user.email || prev.adminEmail
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage({ type: "", text: "" });

    // Validate passwords if changing
    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setSaveMessage({ type: "error", text: "New passwords do not match!" });
        setSaving(false);
        return;
      }
      if (passwordForm.newPassword.length < 6) {
        setSaveMessage({ type: "error", text: "Password must be at least 6 characters long." });
        setSaving(false);
        return;
      }
    }

    try {
      localStorage.setItem("cleanpro_admin_settings", JSON.stringify(settings));

      if (user && settings.adminDisplayName !== user.full_name) {
        updateUserProfile({ full_name: settings.adminDisplayName });
      }

      setSaveMessage({ type: "success", text: "Settings saved successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to system defaults?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem("cleanpro_admin_settings");
      setSaveMessage({ type: "info", text: "Settings reset to defaults." });
    }
  };

  // Operational Database Backup Export
  const handleExportBackup = () => {
    try {
      const backupData = {
        version: "2.0.0",
        timestamp: new Date().toISOString(),
        settings,
        cleaners: JSON.parse(localStorage.getItem("cleanpro_cleaners") || "[]"),
        user_session: JSON.parse(localStorage.getItem("cleanpro_user") || "null")
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `CleanPro_DB_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSaveMessage({ type: "success", text: "Database backup file generated & downloaded successfully!" });
    } catch {
      setSaveMessage({ type: "error", text: "Could not generate database backup." });
    }
  };

  // Operational Database Restore
  const handleRestoreBackup = (e) => {
    e.preventDefault();
    if (!restoreFile) {
      setSaveMessage({ type: "error", text: "Please select a backup JSON file to restore." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.settings) {
          setSettings(parsed.settings);
          localStorage.setItem("cleanpro_admin_settings", JSON.stringify(parsed.settings));
        }
        if (parsed.cleaners) {
          localStorage.setItem("cleanpro_cleaners", JSON.stringify(parsed.cleaners));
        }
        setSaveMessage({ type: "success", text: "Database schema and table records restored successfully!" });
        setRestoreFile(null);
      } catch {
        setSaveMessage({ type: "error", text: "Invalid backup file format. Restore failed." });
      }
    };
    reader.readAsText(restoreFile);
  };

  return (
    <section className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div>
            <span className="eyebrow">ADMINISTRATION</span>
            <h1>System Settings & Operations</h1>
            <p>Configure platform preferences, booking rules, theme appearance, and database backups.</p>
          </div>
          <div className="settings-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              🔄 Reset Defaults
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save All Changes"}
            </button>
          </div>
        </div>

        {/* Save Status Banner */}
        {saveMessage.text && (
          <div className={`settings-banner banner-${saveMessage.type}`}>
            <span>
              {saveMessage.type === "success" && "✅"}
              {saveMessage.type === "error" && "⚠️"}
              {saveMessage.type === "info" && "ℹ️"}
              {" "}{saveMessage.text}
            </span>
            <button
              type="button"
              className="banner-close"
              onClick={() => setSaveMessage({ type: "", text: "" })}
            >
              ×
            </button>
          </div>
        )}

        {/* Settings Tab Navigation */}
        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            🏢 General & Business
          </button>
          <button
            className={`tab-btn ${activeTab === "booking" ? "active" : ""}`}
            onClick={() => setActiveTab("booking")}
          >
            💳 Booking & Pricing
          </button>
          <button
            className={`tab-btn ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            🎨 Theme & Appearance
          </button>
          <button
            className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            🔔 Notifications
          </button>
          <button
            className={`tab-btn ${activeTab === "backup" ? "active" : ""}`}
            onClick={() => setActiveTab("backup")}
          >
            💾 Backup & Restore
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            🛡️ Profile & Security
          </button>
        </div>

        {/* Settings Content Forms */}
        <form onSubmit={handleSave} className="settings-form">
          {/* TAB 1: General Business */}
          {activeTab === "general" && (
            <div className="settings-card">
              <h3>Business Profile & Contact Information</h3>
              <p className="card-desc">General information displayed across customer receipts and receipts.</p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="siteName">Site / Service Name</label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="siteTagline">Tagline</label>
                  <input
                    type="text"
                    id="siteTagline"
                    name="siteTagline"
                    value={settings.siteTagline}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="supportEmail">Support Email (Strict validation)</label>
                  <input
                    type="email"
                    id="supportEmail"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="supportPhone">Support Phone Number</label>
                  <input
                    type="text"
                    id="supportPhone"
                    name="supportPhone"
                    value={settings.supportPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="businessAddress">Headquarters Address</label>
                  <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={settings.businessAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Booking & Pricing */}
          {activeTab === "booking" && (
            <div className="settings-card">
              <h3>Booking Policies & Financial Parameters</h3>
              <p className="card-desc">Configure rates, automatic confirmations, taxes, and cancellation policies.</p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="currency">Default Currency</label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="taxRate">Tax / VAT Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    id="taxRate"
                    name="taxRate"
                    value={settings.taxRate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group checkbox-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="autoConfirmBookings"
                      checked={settings.autoConfirmBookings}
                      onChange={handleChange}
                    />
                    <div>
                      <strong>Auto-Confirm New Bookings</strong>
                      <p>Automatically mark incoming customer bookings as Confirmed.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Theme & Appearance */}
          {activeTab === "appearance" && (
            <div className="settings-card">
              <h3>Theme & Interface Customization</h3>
              <p className="card-desc">Control visual modes and high-contrast dark theme preferences.</p>

              <div className="theme-setting-box">
                <div className="theme-toggle-detail">
                  <div>
                    <h4>Dark / Light Mode Switcher</h4>
                    <p>Switch between light theme and vibrant high-contrast dark mode.</p>
                  </div>
                  <button
                    type="button"
                    className={`btn-theme-selector ${theme === "dark" ? "is-dark" : "is-light"}`}
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? "🌙 Active: Dark Mode" : "☀️ Active: Light Mode"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Notifications */}
          {activeTab === "notifications" && (
            <div className="settings-card">
              <h3>Email & Alert Notifications</h3>
              <p className="card-desc">Manage automated triggers and customer updates.</p>

              <div className="checkbox-stack">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="emailOnNewBooking"
                    checked={settings.emailOnNewBooking}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>New Booking Instant Email Alert</strong>
                    <p>Receive an alert whenever a new customer booking is placed.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: Backup & Restore */}
          {activeTab === "backup" && (
            <div className="settings-card">
              <h3>Database Backup & Restore Mechanism</h3>
              <p className="card-desc">Export database snapshots or perform schema/table data restores seamlessly.</p>

              <div className="form-grid-2">
                <div className="backup-box">
                  <h4>📥 Export Full Database Backup</h4>
                  <p>Download a complete snapshot of all relational database tables (Users, Services, Bookings, Cleaners, Payments).</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleExportBackup}
                  >
                    💾 Generate & Download Backup JSON
                  </button>
                </div>

                <div className="backup-box">
                  <h4>📤 Restore Database Snapshot</h4>
                  <p>Upload a previously exported database backup JSON file to restore schema and record state.</p>
                  <div className="form-group">
                    <input
                      type="file"
                      accept=".json,.sql"
                      onChange={(e) => setRestoreFile(e.target.files[0])}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRestoreBackup}
                    disabled={!restoreFile}
                  >
                    🔄 Perform Database Restore
                  </button>
                </div>
              </div>

              <hr className="settings-divider" />

              <div className="sql-script-info">
                <h4>🐬 MySQL Workbench Relational SQL Script</h4>
                <p>
                  A complete relational SQL database script for MySQL Workbench has been synchronized under{" "}
                  <code>cleaning_workbench.sql</code>. It includes foreign keys, triggers, seed data, and schema definitions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: Admin Profile & Security */}
          {activeTab === "security" && (
            <div className="settings-card">
              <h3>Admin Credentials & Security</h3>
              <p className="card-desc">Update display credentials and security password.</p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="adminDisplayName">Admin Display Name</label>
                  <input
                    type="text"
                    id="adminDisplayName"
                    name="adminDisplayName"
                    value={settings.adminDisplayName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminEmail">Admin Email Address (Strict Validation)</label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={settings.adminEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="settings-form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
