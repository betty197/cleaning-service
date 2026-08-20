export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-box" role="status">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}