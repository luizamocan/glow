import Logo from "./Logo";
import  ICON_LOGOUT from "../assets/logout.png";
import  ICON_HOUSE from "../assets/house.png";
import  ICON_CALENDAR from "../assets/appointment.png";
import  ICON_PROFILE from "../assets/profile.png";
import  ICON_HISTORY from "../assets/history.png";


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

export default function ClientSidebar({ activePage, onNavigate, user, onLogout }) {
  return (
    <div style={s.sidebar} className="sidebar-desktop">
      <div style={s.logo}><Logo size={138} /></div>
      <nav style={s.nav}>

        <div style={s.navItem(activePage === "client-home")} className={"sidebar-item" + (activePage === "client-home" ? " active" : "")} onClick={() => onNavigate("client-home")}>
          <img src={ICON_HOUSE} alt="My Journey" style={s.icon} />
          My Journey
        </div>

       <div style={s.navItem(activePage === "book")} className={"sidebar-item" + (activePage === "book" ? " active" : "")} onClick={() => onNavigate("book")}>
          <img src={ICON_CALENDAR} alt="Book a Glow" style={s.icon} />
          Book a Glow
        </div>

        <div style={s.navItem(activePage === "history")} className={"sidebar-item" + (activePage === "history" ? " active" : "")} onClick={() => onNavigate("history")}>
          <img src={ICON_HISTORY} alt="My Glow History" style={s.icon} />
          My Glow History
        </div>

        <div style={s.navItem(activePage === "profile")} className={"sidebar-item" + (activePage === "profile" ? " active" : "")} onClick={() => onNavigate("profile")}>
          <img src={ICON_PROFILE} alt="My Profile" style={s.icon} />
          My Profile
        </div>
      </nav>

      <div style={s.bottom}>
        <div style={s.logoutRow} onClick={onLogout}>
          <img src={ICON_LOGOUT} alt="Logout" style={s.icon} />
          Log Out
        </div>
        
        <div style={s.divider} />
        <img src={user?.avatar} alt={user?.name} style={s.avatar} />
        <div style={s.name}>{user?.name}</div>
        <div style={s.role}>Client</div>
      </div>
    </div>
  );
}
