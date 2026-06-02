import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { authHeaders } from "../api";
import { API_BASE_URL } from "../config";

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },
  hero: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    height: 180,
    marginTop: 20,
    marginBottom: 24,
    background: "#ecdcc2",
  },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(95,74,40,0.75) 0%, rgba(95,74,40,0.18) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 36px",
  },
  eyebrow: { fontSize: 13, color: "rgba(255,229,189,0.85)", fontWeight: 700, letterSpacing: 2, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: 700, color: "#ffe5bd", lineHeight: 1.15 },
  sectionRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  sectionTitle: { fontSize: 28, fontWeight: 700, color: "#5f4a28" },
  refreshBtn: {
    background: "#ecdcc2",
    border: "none",
    borderRadius: 20,
    padding: "8px 20px",
    fontFamily: "'Libre Bodoni', serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#5f4a28",
    cursor: "pointer",
  },
  tableCard: { background: "#faf3e8", borderRadius: 25, padding: "20px 24px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 18, fontWeight: 400, color: "#5f4a28", padding: "8px 12px", borderBottom: "1px solid #c8b89a" },
  td: { fontSize: 16, color: "rgba(95,74,40,0.84)", padding: "12px 12px", borderBottom: "1px solid #e0d5c5" },
  select: {
    background: "#fff",
    border: "1px solid #e0d5c5",
    borderRadius: 14,
    padding: "6px 10px",
    color: "#5f4a28",
    fontFamily: "'Libre Bodoni', serif",
    fontSize: 15,
  },
  empty: { color: "rgba(95,74,40,0.72)", padding: "24px 12px", fontSize: 17 },
  error: { background: "#fde8e8", color: "#e54949", border: "1px solid #e54949", borderRadius: 12, padding: "10px 14px", marginBottom: 16 },
};

const statuses = ["Upcoming", "Completed", "Cancelled"];

export default function AdminAppointmentsPage({ onNavigate, onLogout, user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: authHeaders(user),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load appointments");
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Could not load appointments");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const updateStatus = async (appointment, status) => {
    const previous = appointments;
    setAppointments((items) => items.map((item) => item.id === appointment.id ? { ...item, status } : item));
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointment.id}/status`, {
        method: "PUT",
        headers: authHeaders(user, { "Content-Type": "application/json" }),
        body: JSON.stringify({ status }),
      });
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(data?.error || "Status update failed");
      if (data) {
        setAppointments((items) => items.map((item) => item.id === appointment.id ? data : item));
      }
    } catch (err) {
      setAppointments(previous);
      setError(err.message || "Status update failed");
    }
  };

  return (
    <div style={s.page} className="page-enter">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');`}</style>
      <Sidebar activePage="appointments" onNavigate={onNavigate} onLogout={onLogout} />
      <main style={s.main} className="main-content">
        <div style={s.hero}>
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80"
            alt="Salon appointment desk"
            style={s.heroImg}
          />
          <div style={s.heroOverlay}>
            <div style={s.eyebrow}>ADMIN DASHBOARD</div>
            <div style={s.title}>Appointments</div>
          </div>
        </div>

        <div style={s.sectionRow} className="services-section-row">
          <div style={s.sectionTitle}>All Appointments</div>
          <button type="button" style={s.refreshBtn} onClick={loadAppointments}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.tableCard} className="responsive-table-card">
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Client</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Service</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Time</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={s.td}>{appointment.clientName || "-"}</td>
                  <td style={s.td}>{appointment.userEmail || "-"}</td>
                  <td style={s.td}>{appointment.service || appointment.serviceName || "-"}</td>
                  <td style={s.td}>{appointment.date}</td>
                  <td style={s.td}>{appointment.time}</td>
                  <td style={s.td}>
                    <select
                      style={s.select}
                      value={appointment.status || "Upcoming"}
                      onChange={(event) => updateStatus(appointment, event.target.value)}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td style={s.empty} colSpan="6">No appointments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
