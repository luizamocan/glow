import Logo from "./Logo";


import  ICON_DASHBOARD from "../assets/dashboard.png";
import  ICON_APPOINTMENTS from "../assets/calendar.png";
import  ICON_SERVICES from "../assets/services.png";
import  ICON_STATISTICS from "../assets/statistics.png";
import  ICON_LOGOUT from "../assets/logout.png";
import AVATAR_IMG from "../assets/client.jpg"; 

const s = {
  sidebar: {
    position: "fixed", top: 0, left: 0, width: "var(--sidebar-w)", height: "100vh",
    background: "rgba(250,243,232,0.95)", backdropFilter: "blur(10px)",
    fontFamily: "'Libre Bodoni', serif", zIndex: 100,
    display: "flex", flexDirection: "column",
  },
  logo: { display: "flex", justifyContent: "center" },
  nav: { padding: "0 29px", marginTop: 16 },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 12,
    padding: "11px 24px", borderRadius: 20, cursor: "pointer",
    background: active ? "#ecdcc2" : "transparent",
    fontWeight: 700, fontSize: 20, color: "#5f4a28",
    marginBottom: 12, transition: "background 0.2s",
  }),
  icon: { width: 28, height: 28, objectFit: "contain", flexShrink: 0 },
  bottom: {
    margin: "auto 29px 0", background: "#ecdcc2", borderRadius: 30,
    padding: "12px 16px", textAlign: "center", marginBottom: 20,
  },
  logoutRow: {
    display: "flex", alignItems: "center", gap: 10,
    fontWeight: 700, fontSize: 20, color: "#5f4a28", cursor: "pointer",
  },
  divider: { height: 1, background: "#c8b89a", margin: "10px 0" },
  avatar: { width: 64, height: 64, borderRadius: "50%", objectFit: "cover", margin: "6px auto", display: "block" },
  name: { fontWeight: 700, fontSize: 16, color: "#5f4a28" },
  role: { fontSize: 13, color: "#5f4a28", opacity: 0.7 },
};

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <div style={s.sidebar} className="sidebar-desktop">
      <div style={s.logo}><Logo size={138} /></div>
      <nav style={s.nav}>
        <div style={s.navItem(activePage === "dashboard")} className={"sidebar-item" + (activePage === "dashboard" ? " active" : "")} onClick={() => onNavigate("dashboard")}>
          <img src={ICON_DASHBOARD} alt="Dashboard" style={s.icon} />
          Dashboard
        </div>
        <div style={s.navItem(activePage === "appointments")} className={"sidebar-item" + (activePage === "appointments" ? " active" : "")} onClick={() => onNavigate("appointments")}>
          <img src={ICON_APPOINTMENTS} alt="Appointments" style={s.icon} />
          Appointments
        </div>
        <div style={s.navItem(activePage === "services")} className={"sidebar-item" + (activePage === "services" ? " active" : "")} onClick={() => onNavigate("services")}>
          <img src={ICON_SERVICES} alt="Services" style={s.icon} />
          Services
        </div>
        <div style={s.navItem(activePage === "statistics")} className={"sidebar-item" + (activePage === "statistics" ? " active" : "")} onClick={() => onNavigate("statistics")}>
          <img src={ICON_STATISTICS} alt="Statistics" style={s.icon} />
          Statistics
        </div>
      </nav>
      <div style={s.bottom}>
        <div style={s.logoutRow} onClick={onLogout}>
          <img src={ICON_LOGOUT} alt="Logout" style={s.icon} />
          Log Out
        </div>
        <div style={s.divider} />
        <img src={AVATAR_IMG} alt="Admin" style={s.avatar} />
        <div style={s.name}>Luiza Mocan</div>
        <div style={s.role}>Admin</div>
      </div>
    </div>
  );
}
