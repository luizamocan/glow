export const AVATAR_HEADER = "https://www.figma.com/api/mcp/asset/75e77366-d72b-489b-b204-cb2b3a0095d6";

export const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 0", borderBottom: "1px solid #e0d5c5", marginBottom: 24 },
  pageTitle: { fontSize: 36, fontWeight: 700, color: "#5f4a28" },
  userCard: { display: "flex", alignItems: "center", gap: 8, background: "#ecdcc2", borderRadius: 20, padding: "5px 12px" },
  userAvatar: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover" },
  userName: { fontWeight: 700, fontSize: 13, color: "#5f4a28" },
  userRole: { fontSize: 11, color: "#5f4a28", opacity: 0.7 },
  sectionTitle: { fontSize: 32, fontWeight: 700, color: "#5f4a28", marginBottom: 16 },
  toggleRow: { display: "flex", gap: 16, marginBottom: 24 },
  toggleActive: {
    background: "#ecdcc2", border: "none", borderRadius: 20, padding: "8px 24px",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, fontWeight: 700,
    color: "#5f4a28", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  },
  toggleInactive: {
    background: "rgba(250,243,232,0.8)", border: "none", borderRadius: 20, padding: "8px 24px",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, fontWeight: 700,
    color: "#5f4a28", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  chartsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  chartCard: { background: "#faf3e8", borderRadius: 20, padding: "20px 24px" },
  chartTitle: { fontSize: 18, fontWeight: 700, color: "#5f4a28", marginBottom: 16 },
  tabularCard: { background: "#faf3e8", borderRadius: 20, padding: "20px 24px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 16, fontWeight: 700, color: "#5f4a28", padding: "10px 12px", borderBottom: "2px solid #c8b89a" },
  td: { fontSize: 15, color: "rgba(95,74,40,0.85)", padding: "12px 12px", borderBottom: "1px solid #e0d5c5" },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "20px 0 4px" },
  pageBtn: (active) => ({
    width: 36, height: 32, borderRadius: 10, border: "none", cursor: "pointer",
    background: active ? "#ecdcc2" : "#fff",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, color: "rgba(95,74,40,0.8)",
  }),
  pageNav: {
    border: "none", background: "none", cursor: "pointer",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, color: "rgba(95,74,40,0.6)",
  },
};
