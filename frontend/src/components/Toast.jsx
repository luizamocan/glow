import { useState, useEffect } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
}

export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  const colors = {
    success: { bg: "#5f4a28", color: "#ffe5bd" },
    error:   { bg: "#e54949", color: "#fff" },
    info:    { bg: "#ecdcc2", color: "#5f4a28" },
  };

  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const style = colors[type] || colors.success;

  return (
    <div className="toast" style={{ background: style.bg, color: style.color }}>
      <span style={{ marginRight: 8 }}>{icons[type]}</span>
      {message}
    </div>
  );
}
