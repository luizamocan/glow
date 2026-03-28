import { useState } from "react";

const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
  modal: {
    background: "#d9d9d9", borderRadius: 20, padding: "40px 48px",
    width: 520, fontFamily: "'Libre Bodoni', serif",
  },
  title: { fontSize: 30, fontWeight: 400, color: "#5f4a28", marginBottom: 28 },
  label: { fontSize: 20, fontWeight: 400, color: "#5f4a28", marginBottom: 6, display: "block" },
  input: {
    width: "100%", height: 36, borderRadius: 20, border: "none",
    padding: "0 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box",
  },
  inputError: {
    width: "100%", height: 36, borderRadius: 20, border: "1.5px solid #e54949",
    padding: "0 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box",
  },
  textarea: {
    width: "100%", height: 60, borderRadius: 20, border: "none",
    padding: "10px 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box", resize: "none",
  },
  textareaError: {
    width: "100%", height: 60, borderRadius: 20, border: "1.5px solid #e54949",
    padding: "10px 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box", resize: "none",
  },
  errorText: { fontSize: 13, color: "#e54949", marginBottom: 12, marginLeft: 14 },
  footer: { display: "flex", justifyContent: "space-between", gap: 16, marginTop: 16 },
  btnCancel: {
    flex: 1, height: 45, borderRadius: 20, border: "none", background: "#fff",
    fontFamily: "'Libre Bodoni', serif", fontSize: 20, color: "#5f4a28", cursor: "pointer",
  },
  btnEdit: {
    flex: 1, height: 45, borderRadius: 20, border: "none", background: "#5f4a28",
    fontFamily: "'Libre Bodoni', serif", fontSize: 20, color: "#ffe5bd", cursor: "pointer",
  },
};

export default function EditServiceModal({ service, onClose, onSave, services }) {
  const [form, setForm] = useState({ ...service });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const newErrors = {};

    // Name
    if (!form.name.trim()) newErrors.name = "Service name is required";
    else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) newErrors.name = "Service name must contain only letters";
    else if (form.name.trim().length < 3) newErrors.name = "Service name must be at least 3 characters";
    else if (form.name.trim().length > 50) newErrors.name = "Service name must be under 50 characters";
    else if (services.some(sv => sv.name.toLowerCase() === form.name.trim().toLowerCase() && sv.id !== form.id))
      newErrors.name = "A service with this name already exists";

    // Price
    const rawPrice = form.price.replace("$", "").trim();
    if (!rawPrice) newErrors.price = "Price is required";
    else if (!/^\d+$/.test(rawPrice) || Number(rawPrice) <= 0) newErrors.price = "Price must be a positive whole number";
    else if (Number(rawPrice) > 10000) newErrors.price = "Price cannot exceed $10,000";

    // Duration
    const rawDuration = form.duration.replace("minutes", "").trim();
    if (!rawDuration) newErrors.duration = "Duration is required";
    else if (!/^\d+$/.test(rawDuration) || Number(rawDuration) <= 0) newErrors.duration = "Duration must be a positive whole number";
    else if (Number(rawDuration) > 480) newErrors.duration = "Duration cannot exceed 480 minutes (8 hours)";

    // Description
    if (form.description.trim().length > 200) newErrors.description = "Description cannot exceed 200 characters";

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const cleanedForm = {
      ...form,
      price: "$" + form.price.replace("$", "").trim(),
      duration: form.duration.replace("minutes", "").trim() + " minutes",
      description: form.description.trim(),
    };
    onSave(cleanedForm);
    onClose();
  };

  return (
    <div style={s.overlay} className="modal-overlay" onClick={onClose}>
      <div style={s.modal} className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={s.title}>✏️ Edit Service</div>

        <label style={s.label}>Service Name</label>
        <input
          style={errors.name ? s.inputError : s.input}
          value={form.name}
          onChange={set("name")}
        />
        {errors.name && <div style={s.errorText}>{errors.name}</div>}

        <label style={s.label}>Price</label>
        <input
          style={errors.price ? s.inputError : s.input}
          value={form.price}
          onChange={set("price")}
        />
        {errors.price && <div style={s.errorText}>{errors.price}</div>}

        <label style={s.label}>Duration</label>
        <input
          style={errors.duration ? s.inputError : s.input}
          value={form.duration}
          onChange={set("duration")}
        />
        {errors.duration && <div style={s.errorText}>{errors.duration}</div>}

        <label style={s.label}>Description</label>
        <textarea
          style={errors.description ? s.textareaError : s.textarea}
          value={form.description}
          onChange={set("description")}
        />
        {errors.description && <div style={s.errorText}>{errors.description}</div>}

        <div style={s.footer}>
          <button style={s.btnCancel} onClick={onClose}>Cancel</button>
          <button style={s.btnEdit} onClick={handleSave}>Edit</button>
        </div>
      </div>
    </div>
  );
}
