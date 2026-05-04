import { useEffect, useState } from "react";
import { saveLastViewedService } from "../cookies";

const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
  modal: {
    background: "#faf3e8", borderRadius: 32, width: 560,
    fontFamily: "'Libre Bodoni', serif", overflow: "hidden",
    boxShadow: "0 8px 40px rgba(95,74,40,0.18)",
    maxHeight: "90vh", display: "flex", flexDirection: "column",
  },
  header: {
    background: "#ecdcc2", padding: "32px 36px 24px",
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    flexShrink: 0,
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
  body: { padding: "28px 36px 32px", overflowY: "auto" },
  statsRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
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
  },
  deleteBtn: {
    flex: 1, height: 44, borderRadius: 20, border: "1.5px solid #e54949",
    background: "transparent", fontFamily: "'Libre Bodoni', serif",
    fontSize: 16, fontWeight: 700, color: "#e54949", cursor: "pointer",
  },
  // ── Appointments section ──
  apptSection: { marginBottom: 28 },
  apptLabel: { fontSize: 12, fontWeight: 700, color: "rgba(95,74,40,0.5)", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" },
  apptRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", borderRadius: 12, marginBottom: 8,
    background: "#fff", border: "1px solid rgba(95,74,40,0.1)",
    fontSize: 14, color: "#5f4a28",
  },
  apptInfo: { display: "flex", flexDirection: "column", gap: 2 },
  apptEmail: { fontWeight: 700, fontSize: 14 },
  apptMeta: { fontSize: 12, opacity: 0.7 },
  statusBadge: (status) => ({
    borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700,
    background: status === "Completed" ? "#d4edda" : status === "Cancelled" ? "#f8d7da" : "#ecdcc2",
    color: status === "Completed" ? "#155724" : status === "Cancelled" ? "#721c24" : "#5f4a28",
  }),
  cancelApptBtn: {
    background: "none", border: "1px solid #e54949", borderRadius: 12,
    color: "#e54949", fontSize: 12, fontWeight: 700, cursor: "pointer",
    padding: "4px 10px", fontFamily: "'Libre Bodoni', serif", marginLeft: 8,
  },
  completeBtn: {
    background: "none", border: "1px solid #5f4a28", borderRadius: 12,
    color: "#5f4a28", fontSize: 12, fontWeight: 700, cursor: "pointer",
    padding: "4px 10px", fontFamily: "'Libre Bodoni', serif", marginLeft: 8,
  },
  emptyAppt: { color: "rgba(95,74,40,0.5)", fontSize: 14, fontStyle: "italic", padding: "8px 0" },
};

export default function ServiceDetailModal({ service, onClose, onEdit, onDelete }) {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  useEffect(() => {
    saveLastViewedService(service);
  }, [service]);

  // ── Fetch appointments for this service ──────────────────────
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppts(true);
      try {
        const res = await fetch(`http://localhost:5000/api/services/${service.id}/appointments`);
        const result = await res.json();
        setAppointments(result.data || []);
      } catch (_) {
        setAppointments([]);
      } finally {
        setLoadingAppts(false);
      }
    };
    fetchAppointments();
  }, [service.id]);

  // ── Cancel an appointment ────────────────────────────────────
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await fetch(`http://localhost:5000/api/services/${service.id}/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      setAppointments(prev =>
        prev.map(a => a.id === appointmentId ? { ...a, status: "Cancelled" } : a)
      );
    } catch (_) {}
  };

  // ── Mark appointment as completed ────────────────────────────
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await fetch(`http://localhost:5000/api/services/${service.id}/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });
      setAppointments(prev =>
        prev.map(a => a.id === appointmentId ? { ...a, status: "Completed" } : a)
      );
    } catch (_) {}
  };

  return (
    <div style={s.overlay} className="modal-overlay" onClick={onClose}>
      <div style={s.modal} className="modal-content" onClick={(e) => e.stopPropagation()}>

        {service.image && (
          <img src={service.image} alt={service.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "32px 32px 0 0", flexShrink: 0 }} />
        )}

        <div style={s.header}>
          <div style={s.headerLeft}>
            <span style={s.badge}>SERVICE DETAILS</span>
            <h2 style={s.serviceName}>{service.name}</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          {/* ── Stats row: price, duration, bookings ── */}
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <div style={s.statLabel}>Price</div>
              <div style={s.statValue}>{service.price}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Duration</div>
              <div style={s.statValue}>{service.duration}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Bookings</div>
              <div style={s.statValue}>{appointments.length}</div>
            </div>
          </div>

          {/* ── Description ── */}
          <div style={s.descSection}>
            <div style={s.descLabel}>Description</div>
            <p style={s.descText}>
              {service.description || "No description provided for this service."}
            </p>
          </div>

          <div style={s.divider} />

          {/* ── Appointments list (1-to-many) ── */}
          <div style={s.apptSection}>
            <div style={s.apptLabel}>
              Appointments ({appointments.length})
            </div>

            {loadingAppts ? (
              <div style={s.emptyAppt}>Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div style={s.emptyAppt}>No appointments booked for this service yet.</div>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} style={s.apptRow}>
                  <div style={s.apptInfo}>
                    <span style={s.apptEmail}>{appt.userEmail}</span>
                    <span style={s.apptMeta}>{appt.date} • {appt.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={s.statusBadge(appt.status)}>{appt.status}</span>
                    {appt.status === "Upcoming" && (
                      <>
                        <button style={s.completeBtn} onClick={() => handleCompleteAppointment(appt.id)}>
                          ✓ Done
                        </button>
                        <button style={s.cancelApptBtn} onClick={() => handleCancelAppointment(appt.id)}>
                          ✕ Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={s.divider} />

          {/* ── Footer ── */}
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