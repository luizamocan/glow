import React, { useState, useEffect } from 'react';
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

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },
  header: { marginTop: 40, marginBottom: 32 },
  title: { fontSize: 48, fontWeight: 700, color: "#5f4a28", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "rgba(95,74,40,0.7)" },
  tabs: { display: "flex", gap: 20, marginBottom: 32, borderBottom: "1px solid #e0d5c5", paddingBottom: 12 },
  tab: (active) => ({
    fontSize: 18, fontWeight: active ? 700 : 400, color: "#5f4a28",
    cursor: "pointer", opacity: active ? 1 : 0.6, transition: "0.2s",
    borderBottom: active ? "3px solid #5f4a28" : "3px solid transparent",
    paddingBottom: 8
  }),
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 },
  card: {
    background: "#faf3e8", borderRadius: 25, overflow: "hidden",
    border: "1px solid #e0d5c5", display: "flex", flexDirection: "column",
    transition: "transform 0.2s", cursor: "default"
  },
  cardImg: { width: "100%", height: 180, objectFit: "cover" },
  cardContent: { padding: 20, flex: 1, display: "flex", flexDirection: "column" },
  cardName: { fontSize: 22, fontWeight: 700, color: "#5f4a28", marginBottom: 6 },
  cardPrice: { fontSize: 18, fontWeight: 700, color: "#5f4a28", marginBottom: 12 },
  bookBtn: {
    background: "#5f4a28", color: "#ffe5bd", border: "none", borderRadius: 20,
    padding: "10px 0", fontFamily: "'Libre Bodoni', serif", fontSize: 16,
    fontWeight: 700, cursor: "pointer", marginTop: "auto"
  },
  searchBar: {
    width: "100%", maxWidth: 400, height: 45, borderRadius: 20,
    border: "1px solid #e0d5c5", background: "#faf3e8",
    padding: "0 20px", fontSize: 16, color: "#5f4a28",
    outline: "none", marginBottom: 30, fontFamily: "'Libre Bodoni', serif"
  },
 overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 },
  modal: { background: "#d9d9d9", borderRadius: 25, padding: "40px", width: 450, fontFamily: "'Libre Bodoni', serif" },
  modalTitle: { fontSize: 28, color: "#5f4a28", marginBottom: 20, textAlign: "center" },
  input: { 
    width: "100%", padding: "12px", borderRadius: 15, border: "none", 
    marginBottom: 15, fontSize: 16, fontFamily: "'Libre Bodoni', serif", 
    color: "#5f4a28", boxSizing: "border-box" 
  },
  modalFooter: { display: "flex", gap: 12, marginTop: 10 },
  confirmBtn: { 
    flex: 2, padding: "12px", background: "#5f4a28", color: "#ffe5bd", 
    border: "none", borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: "pointer" 
  },
  cancelBtn: { 
    flex: 1, padding: "12px", background: "#fff", color: "#5f4a28", 
    border: "1.5px solid #5f4a28", borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: "pointer", textAlign: "center"
  }
};

function StarRating({ rating = 5 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#c8a96e" : "#ddd", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}


const generateTimes = () => {
  const times = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const m = min === 0 ? '00' : min;
      times.push(`${h}:${m} ${ampm}`);
      if (hour === 20) break; 
    }
  }
  return times;
};

export default function BookAGlow({ onNavigate, user, services, onLogout, initialService, onBook}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  const [bookingService, setBookingService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const timeOptions = generateTimes();

 
  useEffect(() => {
    if (initialService) {
      setBookingService(initialService);
      onNavigate("book",null);
    }
  }, [initialService]);

  const handleConfirm = () => {
    if (!date || !time) return alert("Please select both a date and time.");
    onBook({
    service: bookingService.name,
    date: date,
    time: time,
    price: bookingService.price
  });

    setBookingService(null);
    setDate("");
    setTime("");

    onNavigate("book",null); 
    onNavigate("history");
  };

  const filteredServices = services.filter(sv => {
    return sv.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={s.page}>
      <ClientSidebar activePage="book" onNavigate={onNavigate} user={user} onLogout={onLogout} />
      
      <main style={s.main}>
        <header style={s.header}>
          <h1 style={s.title}>Book Your Glow</h1>
          <p style={s.subtitle}>Treat yourself to a signature experience.</p>
        </header>

        <input 
          type="text" 
          placeholder="Search for a service..." 
          style={s.searchBar} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={s.tabs}>
          {["All", "Skin", "Hair", "Body"].map(cat => (
            <div key={cat} style={s.tab(activeTab === cat)} onClick={() => setActiveTab(cat)}>{cat}</div>
          ))}
        </div>

        <div style={s.grid}>
          {filteredServices.map(sv => (
            <div key={sv.id} style={s.card}>
              <img src={SERVICE_IMAGES[sv.name] || IMG_FACIAL} alt={sv.name} style={s.cardImg} />
              <div style={s.cardContent}>
                <h3 style={s.cardName}>{sv.name}</h3>
                <StarRating />
                <div style={s.cardPrice}>${sv.price} • {sv.duration} min</div>
                <button style={s.bookBtn} onClick={() => setBookingService(sv)}>Book Appointment</button>
              </div>
            </div>
          ))}
        </div>

        {bookingService && (
          <div style={s.overlay} onClick={() => setBookingService(null)}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
              <h2 style={s.modalTitle}>Book {bookingService.name}</h2>
              
              <label style={{display:'block', marginBottom: 5, color: '#5f4a28', fontWeight: 700}}>Select Date</label>
              <input 
                type="date" 
                style={s.input} 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                min={new Date().toISOString().split("T")[0]} 
              />
              
              <label style={{display:'block', marginBottom: 5, color: '#5f4a28', fontWeight: 700}}>Select Time</label>
              <select 
                style={s.input} 
                value={time} 
                onChange={e => setTime(e.target.value)}
              >
                <option value="">Choose a time...</option>
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div style={s.modalFooter}>
                <button style={s.cancelBtn} onClick={() => setBookingService(null)}>Cancel</button>
                <button style={s.confirmBtn} onClick={handleConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}