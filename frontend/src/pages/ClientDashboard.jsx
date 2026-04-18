import { useState } from "react";
import ClientSidebar from "../components/ClientSidebar";
import IMG_MASSAGE from "../assets/massage.jpg";
import IMG_FACIAL from "../assets/facial.jpg";
import IMG_MANICURE from "../assets/manicure.jpg";
import IMG_BLOWDRY from "../assets/blow-dry.jpg";
import IMG_HAIRCUT from "../assets/haircut.jpg";
import IMG_COLLORING from "../assets/hair-coloring.jpg";
import IMG_PEDICURE from "../assets/pedicure.jpg";
import IMG_TREATMENT from "../assets/spa-treatment.jpg";
import IMG_SHAPING from "../assets/eyebrow-shaping.jpg";
import { saveMoodPreference, getMoodPreference } from "../cookies";



import ICON_RAIN from "../assets/rain.png";
import ICON_LEAF from  "../assets/leaf.png";
import  ICON_THUNDER from "../assets/lightning-bolt.png";
import  ICON_STAR from "../assets/star.png";


// Mood → recommended services mapping
const MOOD_RECOMMENDATIONS = {
  Tired:        ["Deep Massage", "Spa Treatment", "Facial", "Pedicure"],
  Relaxed:      ["Manicure", "Eyebrow Shaping", "Haircut", "Pedicure"],
  Stressed:     ["Deep Massage", "Spa Treatment", "Manicure", "Facial"],
  "Want to Glow": ["Facial", "Hair Coloring", "Manicure", "Blow dry"],
};

const MOODS = [
  { label: "Tired",        icon: ICON_RAIN,    bg: "#c8c4d4" },
  { label: "Relaxed",      icon: ICON_LEAF,    bg: "#c8d4c4" },
  { label: "Stressed",     icon: ICON_THUNDER, bg: "#b0b8c8" },
  { label: "Want to Glow", icon: ICON_STAR,    bg: "#e8c8e0" },
];

const SERVICE_IMAGES = {
  "Deep Massage": IMG_MASSAGE,
  "Facial": IMG_FACIAL,
  "Manicure": IMG_MANICURE,
  "Hair Coloring": IMG_COLLORING,
  "Spa Treatment": IMG_TREATMENT,
  "Pedicure": IMG_PEDICURE,
  "Haircut": IMG_HAIRCUT,
  "Eyebrow Shaping": IMG_SHAPING,
  "Blow dry": IMG_BLOWDRY,
};

const getRating = (name) => {
  const ratings = { "Deep Massage": 5, "Facial": 5, "Manicure": 4, "Spa Treatment": 5, "Pedicure": 4, "Haircut": 4, "Eyebrow Shaping": 4, "Hair Coloring": 3 };
  return ratings[name] || 4;
};

function StarRating({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#c8a96e" : "#ddd", fontSize: 20 }}>★</span>
      ))}
    </span>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 0", borderBottom: "1px solid #e0d5c5", marginBottom: 16 },
  pageTitle: { fontSize: 36, fontWeight: 700, color: "#5f4a28" },
  tagline: { fontSize: 18, color: "rgba(95,74,40,0.7)", marginTop: 2 },
  userCard: { display: "flex", alignItems: "center", gap: 8, background: "#ecdcc2", borderRadius: 20, padding: "5px 12px" },
  userAvatar: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover" },
  userName: { fontWeight: 700, fontSize: 13, color: "#5f4a28" },
  userRole: { fontSize: 11, color: "#5f4a28", opacity: 0.7 },
  welcomeText: { fontSize: 36, fontWeight: 700, color: "#5f4a28", margin: "16px 0 20px" },
  card: {
    background: "#faf3e8", border: "1px solid #5f4a28", borderRadius: 25,
    padding: "28px 32px", boxShadow: "0 4px 4px rgba(0,0,0,0.1)",
  },
  moodTitle: { fontSize: 24, fontWeight: 700, color: "#5f4a28", textAlign: "center", marginBottom: 8 },
  moodSubtitle: { fontSize: 22, fontWeight: 700, color: "#5f4a28", textAlign: "center", marginBottom: 24 },
  moodsRow: { display: "flex", justifyContent: "center", gap: 40, marginBottom: 32 },
  moodBtn: (active, bg) => ({
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    cursor: "pointer", border: "none", background: "none",
  }),
  moodCircle: (active, bg) => ({
    width: 110, height: 110, borderRadius: "50%",
    background: bg, display: "flex", alignItems: "center", justifyContent: "center",
    border: active ? "3px solid #5f4a28" : "3px solid transparent",
    transition: "border 0.2s, transform 0.15s",
    transform: active ? "scale(1.08)" : "scale(1)",
    boxShadow: active ? "0 4px 12px rgba(95,74,40,0.3)" : "none",
  }),
  moodIcon: { width: 50, height: 50, objectFit: "contain"},
  moodLabel: { fontSize: 16, fontWeight: 700, color: "#000", textAlign: "center" },
  servicesRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  serviceCard: (isBest) => ({
    flex: isBest ? "0 0 300px" : "0 0 160px",
    background: "#ecdcc2", borderRadius: 20, overflow: "hidden",
    position: "relative", minHeight: 228,
    display: "flex", flexDirection: "column",
  }),
  bestBadge: {
    position: "absolute", top: -2, left: 8,
    background: "rgba(95,74,40,0.7)", color: "#ecdcc2",
    borderRadius: 20, padding: "4px 14px", fontSize: 16, fontWeight: 700, zIndex: 2,
  },
  serviceImg: { width: "100%", height: 95, objectFit: "cover", borderRadius: "20px 20px 0 0" },
  serviceName: { fontSize: 20, fontWeight: 700, color: "#5f4a28", textAlign: "center", margin: "8px 0 4px" },
  bookBtn: {
    background: "rgba(95,74,40,0.6)", border: "none", borderRadius: 20,
    color: "#ecdcc2", fontFamily: "'Libre Bodoni', serif",
    fontSize: 16, fontWeight: 700, padding: "8px 0",
    margin: "auto 16px 12px", cursor: "pointer", width: "calc(100% - 32px)",
    transition: "background 0.2s",
  },
};


export default function ClientDashboard({ onNavigate, user, services, onLogout }) {
  const [selectedMood, setSelectedMood] = useState(getMoodPreference() || "Relaxed");

  const recommendedNames = MOOD_RECOMMENDATIONS[selectedMood] || [];
  const recommended = recommendedNames.map((name, i) => {
    const found = services.find(sv => sv.name === name);
    return found || { id: i + 100, name, price: "$50", duration: "60 minutes", description: "" };
  });

  return (
    <div style={s.page} className="page-enter">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');`}</style>
      <ClientSidebar activePage="client-home" onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main style={s.main} className="main-content">
        {/* Hero banner */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          height: 180, marginTop: 20, marginBottom: 24,
        }}>
          <img
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80"
            alt="Spa banner"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(95,74,40,0.7) 0%, rgba(95,74,40,0.2) 100%)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 36px",
          }}>
            <div style={{ fontSize: 13, color: "rgba(255,229,189,0.85)", fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
              YOUR SIGNATURE SHINE IS WAITING
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#ffe5bd", lineHeight: 1.15 }}>
              Welcome back, {user?.name?.split(" ")[0]}!
            </div>
          </div>
          <div style={{
            position: "absolute", top: 16, right: 16,
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(250,243,232,0.9)", borderRadius: 20, padding: "5px 12px",
          }}>
            <img src={user?.avatar} alt={user?.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#5f4a28" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "#5f4a28", opacity: 0.7 }}>Client</div>
            </div>
          </div>
        </div>

        {/* Glow Selector card */}
        <div style={s.card}>
          <div style={s.moodTitle}>Glow Selector: The Mood-Based Treatment Recommender</div>
          <div style={s.moodSubtitle}>How is your spirit today?</div>

          {/* Mood buttons */}
          <div style={s.moodsRow}>
            {MOODS.map(mood => (
              <div key={mood.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div
                  style={s.moodCircle(selectedMood === mood.label, mood.bg)} className={"mood-circle" + (selectedMood === mood.label ? " selected" : "")}
                  onClick={() => {
                    setSelectedMood(mood.label);
                    saveMoodPreference(mood.label);
                    }}
                >
                  <img src={mood.icon} alt={mood.label} style={s.moodIcon} />
                </div>
                <span style={s.moodLabel}>{mood.label}</span>
              </div>
            ))}
          </div>

          {/* Recommended services */}
          <div style={s.servicesRow}>
            {recommended.map((sv, i) => (
              <div key={sv.id} style={s.serviceCard(i === 0)} className="service-card-hover">
                {i === 0 && <div style={s.bestBadge}>Best match!</div>}
                <img
                  src={SERVICE_IMAGES[sv.name] || IMG_FACIAL}
                  alt={sv.name}
                  style={s.serviceImg}
                />
                <div style={s.serviceName}>{sv.name}</div>
                <div style={{ textAlign: "center", margin: "4px 0" }}>
                  <StarRating rating={getRating(sv.name)} />
                </div>
                <button 
                  style={s.bookBtn} 
                  onClick={() => onNavigate("book", sv)} 
                >
                  Book now!
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
