export const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "40px" },
  
  container: { display: "flex", gap: "30px", alignItems: "flex-start" },
  

  sideCard: { 
    flex: "0 0 300px", background: "#faf3e8", borderRadius: 25, 
    padding: "30px", border: "1px solid #5f4a28", textAlign: "center" 
  },
  avatar: { width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 15, border: "3px solid #5f4a28" },
  

  contentArea: { flex: 1, display: "flex", flexDirection: "column", gap: "25px" },
  
  infoCard: { background: "#ecdcc2", borderRadius: 25, padding: "30px", color: "#5f4a28" },
  statsRow: { display: "flex", gap: "20px", marginBottom: "10px" },
  statBox: { 
    flex: 1, background: "#faf3e8", padding: "20px", borderRadius: 20, 
    textAlign: "center", border: "1px solid rgba(95,74,40,0.3)" 
  },
  
  label: { display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, opacity: 0.8 },
  input: { 
    width: "100%", padding: "12px", borderRadius: 12, border: "1px solid #5f4a28", 
    background: "#fff", marginBottom: 15, fontFamily: "'Libre Bodoni', serif" 
  },
  
  saveBtn: { 
    background: "#5f4a28", color: "#ffe5bd", border: "none", 
    padding: "12px 25px", borderRadius: 20, fontWeight: 700, cursor: "pointer" 
  }
};