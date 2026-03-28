const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
  modal: {
    background: "#faf3e8", borderRadius: 32, width: 520,
    fontFamily: "'Libre Bodoni', serif", overflow: "hidden",
    boxShadow: "0 8px 40px rgba(95,74,40,0.18)",
  },
  header: {
    background: "#ecdcc2", padding: "32px 36px 24px",
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
  },
  headerLeft: { display: "flex", flexDirection: "column", gap: 6 },
  badge: {
    display: "inline-block", background: "#5f4a28", color: "#ffe5bd",
    fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "3px 14px",
    letterSpacing: 1, marginBottom: 6, alignSelf: "flex-start",
  },
  serviceName: { fontSize: 36, fontWeight: 400, color: "#5f4a28", margin: 0, lineHeight: 1.1 },
  closeBtn: {
    background: "rgba(95,74,40,0.12)", border: "none", borderRadius: "50%",
    width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#5f4a28",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginLeft: 16,
  },
  body: { padding: "28px 36px 32px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 16, marginBottom: 28,
  },
  statCard: {
    background: "#fff", borderRadius: 16, padding: "16px 20px",
    border: "1px solid rgba(95,74,40,0.12)",
  },
  statLabel: { fontSize: 12, fontWeight: 700, color: "rgba(95,74,40,0.5)", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" },
  statValue: { fontSize: 28, fontWeight: 700, color: "#5f4a28" },
  descSection: { marginBottom: 28 },
  descLabel: { fontSize: 12, fontWeight: 700, color: "rgba(95,74,40,0.5)", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" },
  descText: { fontSize: 16, color: "#5f4a28", lineHeight: 1.6, margin: 0 },
  divider: { height: 1, background: "rgba(95,74,40,0.12)", marginBottom: 24 },
  footer: { display: "flex", gap: 12 },
  editBtn: {
    flex: 1, height: 44, borderRadius: 20, border: "1.5px solid #5f4a28",
    background: "transparent", fontFamily: "'Libre Bodoni', serif",
    fontSize: 16, fontWeight: 700, color: "#5f4a28", cursor: "pointer",
    transition: "background 0.2s",
  },
  deleteBtn: {
    flex: 1, height: 44, borderRadius: 20, border: "1.5px solid #e54949",
    background: "transparent", fontFamily: "'Libre Bodoni', serif",
    fontSize: 16, fontWeight: 700, color: "#e54949", cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default function ServiceDetailModal({ service, onClose, onEdit, onDelete }) {
  return (
    <div style={s.overlay} className="modal-overlay" onClick={onClose}>
      <div style={s.modal} className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Service image */}
        {service.image && (
          <img src={service.image} alt={service.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "32px 32px 0 0" }} />
        )}
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <span style={s.badge}>SERVICE DETAILS</span>
            <h2 style={s.serviceName}>{service.name}</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={s.body}>

          {/* Price + Duration cards */}
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <div style={s.statLabel}>Price</div>
              <div style={s.statValue}>{service.price}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Duration</div>
              <div style={s.statValue}>{service.duration}</div>
            </div>
          </div>

          {/* Description */}
          <div style={s.descSection}>
            <div style={s.descLabel}>Description</div>
            <p style={s.descText}>
              {service.description || "No description provided for this service."}
            </p>
          </div>

          <div style={s.divider} />

          {/* Action buttons */}
          <div style={s.footer}>
            <button style={s.editBtn} onClick={() => { onEdit(service); onClose(); }}>
              Edit Service
            </button>
            <button style={s.deleteBtn} onClick={() => { onDelete(service); onClose(); }}>
              Delete Service
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
