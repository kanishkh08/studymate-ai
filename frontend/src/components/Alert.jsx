// Feedback box for errors, success messages and hints.
const styles = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-brand-200 bg-brand-50 text-brand-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

export default function Alert({ type = "info", children, className = "" }) {
  if (!children) return null;
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${styles[type]} ${className}`}
    >
      {children}
    </div>
  );
}
