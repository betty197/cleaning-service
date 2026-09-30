import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

const INITIAL_LOGS = [
  {
    id: 1,
    title: "System Synchronized",
    message: "Admin Control Center metrics linked to live user database.",
    time: "Just now",
    type: "system",
    read: false
  },
  {
    id: 2,
    title: "User Role Updated",
    message: "Dawit Worku assigned as Active Cleaner.",
    time: "5m ago",
    type: "user",
    read: false
  },
  {
    id: 3,
    title: "Service Catalog Updated",
    message: "Deep Cleaning service price updated.",
    time: "15m ago",
    type: "service",
    read: true
  }
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_LOGS);
  const [toast, setToast] = useState(null);

  const notify = useCallback((title, message, type = "info") => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just now",
      type,
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Show toast banner
    setToast(newNotif);
    setTimeout(() => {
      setToast((current) => (current?.id === newNotif.id ? null : current));
    }, 4500);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toast,
        notify,
        markAllAsRead,
        dismissToast
      }}
    >
      {children}

      {/* Global Real-Time Toast Banner Popup */}
      {toast && (
        <div className="admin-realtime-toast">
          <div className="toast-icon-wrap">
            {toast.type === "user" && "👤"}
            {toast.type === "service" && "🧰"}
            {toast.type === "booking" && "📅"}
            {toast.type === "system" && "⚡"}
            {toast.type === "info" && "🔔"}
          </div>
          <div className="toast-body">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
          <button type="button" className="toast-close" onClick={dismissToast}>
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
