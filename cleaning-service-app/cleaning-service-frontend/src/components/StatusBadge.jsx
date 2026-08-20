export default function StatusBadge({ status }) {
  const value = String(status || "Pending");
  const normalized = value.toLowerCase();
  const className =
    normalized.includes("confirm") ? "status-confirmed" :
    normalized.includes("complete") ? "status-completed" :
    normalized.includes("cancel") ? "status-cancelled" :
    normalized.includes("paid") ? "status-completed" :
    "status-pending";

  return <span className={`status-badge ${className}`}>{value}</span>;
}