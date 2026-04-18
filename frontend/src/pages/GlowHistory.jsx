import React from 'react';
import ClientSidebar from "../components/ClientSidebar";

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },
  header: { marginTop: 40, marginBottom: 32 },
  title: { fontSize: 48, fontWeight: 700, color: "#5f4a28", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "rgba(95,74,40,0.7)" },
  
  sectionTitle: { fontSize: 28, fontWeight: 700, color: "#5f4a28", marginTop: 40, marginBottom: 20, borderBottom: "1px solid #e0d5c5", paddingBottom: 10 },
  
  list: { display: "flex", flexDirection: "column", gap: 16 },
  appointmentCard: (isFuture) => ({
    background: isFuture ? "#ecdcc2" : "#faf3e8",
    borderRadius: 20,
    padding: "20px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: isFuture ? "1px solid #5f4a28" : "1px solid #e0d5c5",
    boxShadow: isFuture ? "0 4px 12px rgba(95,74,40,0.1)" : "none",
  }),

  infoGroup: { display: "flex", flexDirection: "column", gap: 4 },
  serviceName: { fontSize: 22, fontWeight: 700, color: "#5f4a28" },
  dateText: { fontSize: 16, color: "#5f4a28", opacity: 0.8 },
  
  badge: (isFuture) => ({
    padding: "6px 16px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 700,
    background: isFuture ? "#5f4a28" : "rgba(95,74,40,0.1)",
    color: isFuture ? "#ffe5bd" : "#5f4a28",
  }),

  emptyState: { textAlign: "center", padding: "40px", color: "#5f4a28", opacity: 0.5, fontStyle: "italic" },
  
  cancelBtn: {
    background: "none",
    border: "1px solid #5f4a28",
    color: "#5f4a28",
    borderRadius: "15px",
    padding: "5px 12px",
    fontSize: "12px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 0.2s",
    fontFamily: "'Libre Bodoni', serif"
  }
};

export default function GlowHistory({ onNavigate, user, onLogout, appointments, cancelAppointment }) {
  // Only show appointments belonging to this client
  const myGlows = appointments.filter(app => app.userEmail === user?.email);

  const futureGlows = myGlows.filter(app => app.status === "Upcoming");
  const pastGlows = myGlows.filter(app => app.status === "Completed");

  return (
    <div style={s.page}>
      <ClientSidebar activePage="history" onNavigate={onNavigate} user={user} onLogout={onLogout} />
      
      <main style={s.main}>
        <header style={s.header}>
          <h1 style={s.title}>My Glow History</h1>
          <p style={s.subtitle}>Review your past transformations and look forward to your next shine.</p>
        </header>

        {/* --- FUTURE SECTION --- */}
        <section>
          <h2 style={s.sectionTitle}>Upcoming Glows</h2>
          <div style={s.list}>
            {futureGlows.length > 0 ? futureGlows.map(app => (
              <div key={app.id} style={s.appointmentCard(true)}>
                <div style={s.infoGroup}>
                  <div style={s.serviceName}>{app.service}</div>
                  <div style={s.dateText}>{app.date} at {app.time}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{fontWeight: 700, color: "#5f4a28", marginBottom: 4}}>{app.price}</div>
                  <div style={s.badge(true)}>Confirmed</div>
                  {/* Cancel Button */}
                  <button 
                    style={s.cancelBtn} 
                    onClick={() => cancelAppointment(app.id)}
                  >
                    Cancel Glow
                  </button>
                </div>
              </div>
            )) : <div style={s.emptyState}>No upcoming appointments. Time for a new glow?</div>}
          </div>
        </section>

        {/* --- PAST SECTION --- */}
        <section>
          <h2 style={s.sectionTitle}>Past Glows</h2>
          <div style={s.list}>
            {pastGlows.length > 0 ? pastGlows.map(app => (
              <div key={app.id} style={s.appointmentCard(false)}>
                <div style={s.infoGroup}>
                  <div style={s.serviceName}>{app.service}</div>
                  <div style={s.dateText}>{app.date}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{color: "#c8a96e", fontSize: 18, marginBottom: 4}}>
                    {"★".repeat(app.rating || 5)}{"☆".repeat(5 - (app.rating || 5))}
                  </div>
                  <div style={s.badge(false)}>Completed</div>
                </div>
              </div>
            )) : <div style={s.emptyState}>Your journey is just beginning!</div>}
          </div>
        </section>
      </main>
    </div>
  );
}