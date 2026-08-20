export default function FormInput({ label, error, ...props }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}