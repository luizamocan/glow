import Logo from "./Logo";


import  ICON_SERVICES from "../assets/services.png";
import  ICON_APPOINTMENTS from "../assets/calendar.png";
import  ICON_STATISTICS from "../assets/statistics.png";
import  ICON_LOGOUT from "../assets/logout.png";
import  ICON_SECURITY from "../assets/profile.png";
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
  mobileNav: {
    display: "none",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(250,243,232,0.97)",
    borderTop: "1px solid #ecdcc2",
    padding: "8px 0 12px",
    zIndex: 9999,
    justifyContent: "space-around",
    fontFamily: "'Libre Bodoni', serif",
    pointerEvents: "auto",
  },
  mobileItem: (active) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    minWidth: 58,
    padding: "5px 4px",
    borderRadius: 12,
    background: active ? "#ecdcc2" : "transparent",
    border: "none",
    color: "#5f4a28",
    fontFamily: "'Libre Bodoni', serif",
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
  }),
  mobileIcon: { width: 22, height: 22, objectFit: "contain" },
};

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <>
      <div style={s.sidebar} className="sidebar-desktop">
        <div style={s.logo}><Logo size={138} /></div>
        <nav style={s.nav}>
          <div style={s.navItem(activePage === "services")} className={"sidebar-item" + (activePage === "services" ? " active" : "")} onClick={() => onNavigate("services")}>
            <img src={ICON_SERVICES} alt="Services" style={s.icon} />
            Services
          </div>
          <div style={s.navItem(activePage === "appointments")} className={"sidebar-item" + (activePage === "appointments" ? " active" : "")} onClick={() => onNavigate("appointments")}>
            <img src={ICON_APPOINTMENTS} alt="Appointments" style={s.icon} />
            Appointments
          </div>
          <div style={s.navItem(activePage === "statistics")} className={"sidebar-item" + (activePage === "statistics" ? " active" : "")} onClick={() => onNavigate("statistics")}>
            <img src={ICON_STATISTICS} alt="Statistics" style={s.icon} />
            Statistics
          </div>
          <div style={s.navItem(activePage === "security")} className={"sidebar-item" + (activePage === "security" ? " active" : "")} onClick={() => onNavigate("security")}>
            <img src={ICON_SECURITY} alt="Security Logs" style={s.icon} />
            Security Logs
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

      <nav style={s.mobileNav} className="mobile-nav" aria-label="Admin navigation">
        <button type="button" style={s.mobileItem(activePage === "services")} className="mobile-nav-item" onClick={() => onNavigate("services")}>
          <img src={ICON_SERVICES} alt="" style={s.mobileIcon} className="mobile-nav-icon" />
          Services
        </button>
        <button type="button" style={s.mobileItem(activePage === "appointments")} className="mobile-nav-item" onClick={() => onNavigate("appointments")}>
          <img src={ICON_APPOINTMENTS} alt="" style={s.mobileIcon} className="mobile-nav-icon" />
          Appts
        </button>
        <button type="button" style={s.mobileItem(activePage === "statistics")} className="mobile-nav-item" onClick={() => onNavigate("statistics")}>
          <img src={ICON_STATISTICS} alt="" style={s.mobileIcon} className="mobile-nav-icon" />
          Stats
        </button>
        <button type="button" style={s.mobileItem(activePage === "security")} className="mobile-nav-item" onClick={() => onNavigate("security")}>
          <img src={ICON_SECURITY} alt="" style={s.mobileIcon} className="mobile-nav-icon" />
          Logs
        </button>
        <button type="button" style={s.mobileItem(false)} className="mobile-nav-item" onClick={onLogout}>
          <img src={ICON_LOGOUT} alt="" style={s.mobileIcon} className="mobile-nav-icon" />
          Logout
        </button>
      </nav>
    </>
  );
}
