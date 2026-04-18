import React, { useState } from 'react';
import ClientSidebar from "../components/ClientSidebar";
import { s } from "./ProfilePage.styles";

export default function ProfilePage({ onNavigate, user, appointments, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 000-0000" // Mock data
  });

  // Calculate real stats from the appointments array
  const totalGlows = appointments.filter(a => a.status === "Completed").length;
  const upcomingGlows = appointments.filter(a => a.status === "Upcoming").length;

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div style={s.page}>
      <ClientSidebar activePage="profile" onNavigate={onNavigate} user={user} onLogout={onLogout} />
      
      <main style={s.main}>
        <div style={s.container}>
          
          {/* LEFT: Identity Card */}
          <div style={s.sideCard}>
            <img src={user?.avatar} alt="Profile" style={s.avatar} />
            <h2 style={{ color: "#5f4a28", margin: "0 0 5px" }}>{formData.name}</h2>
            <p style={{ opacity: 0.7, margin: "0 0 20px" }}>Shining since 2024</p>
            <button style={s.saveBtn} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* RIGHT: Stats & Info */}
          <div style={s.contentArea}>
            
            {/* Stats Summary */}
            <div style={s.statsRow}>
              <div style={s.statBox}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#5f4a28" }}>{totalGlows}</div>
                <div style={s.label}>Total Glows</div>
              </div>
              <div style={s.statBox}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#5f4a28" }}>{upcomingGlows}</div>
                <div style={s.label}>Upcoming</div>
              </div>
              <div style={s.statBox}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#5f4a28" }}>5.0</div>
                <div style={s.label}>Avg. Rating</div>
              </div>
            </div>

            {/* Personal Info Card */}
            <div style={s.infoCard}>
              <h3 style={{ marginBottom: 20 }}>Personal Information</h3>
              
              <label style={s.label}>Full Name</label>
              {isEditing ? (
                <input style={s.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              ) : <p style={{ marginBottom: 20, fontSize: 18 }}>{formData.name}</p>}

              <label style={s.label}>Email Address</label>
              {isEditing ? (
                <input style={s.input} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              ) : <p style={{ marginBottom: 20, fontSize: 18 }}>{formData.email}</p>}

              {isEditing && (
                <button style={s.saveBtn} onClick={handleSave}>Save Changes</button>
              )}
            </div>

            {/* Beauty Preferences Placeholder */}
            <div style={{...s.infoCard, background: "#faf3e8", border: "1px solid #ecdcc2"}}>
              <h3 style={{ marginBottom: 15 }}>Beauty Passport</h3>
              <p style={{ opacity: 0.8 }}>Skin Type: Sensitive • Hair Type: Straight</p>
              <p style={{ opacity: 0.8, marginTop: 10 }}>Notes: Prefer organic oils and medium pressure during massages.</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}