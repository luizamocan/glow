export const AVATAR_HEADER = "https://www.figma.com/api/mcp/asset/75e77366-d72b-489b-b204-cb2b3a0095d6";
export const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },

  // Top bar
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 0", borderBottom: "1px solid #e0d5c5", marginBottom: 28 },
  pageTitle: { fontSize: 36, fontWeight: 700, color: "#5f4a28" },
  userCard: { display: "flex", alignItems: "center", gap: 12, background: "#ecdcc2", borderRadius: 20, padding: "8px 20px" },
  userAvatar: { width: 48, height: 48, borderRadius: "50%", objectFit: "cover" },
  userName: { fontWeight: 700, fontSize: 18, color: "#5f4a28" },
  userRole: { fontSize: 14, color: "#5f4a28", opacity: 0.7 },

  // Section header
  sectionRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  sectionTitle: { fontSize: 28, fontWeight: 700, color: "#5f4a28" },
  addBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "#ecdcc2",
    border: "none", borderRadius: 20, padding: "8px 20px",
    fontFamily: "'Libre Bodoni', serif", fontSize: 18, fontWeight: 700,
    color: "#5f4a28", cursor: "pointer", transition: "background 0.2s",
  },

  // Table card
  tableCard: { background: "#faf3e8", borderRadius: 25, padding: "20px 24px" },
  tableTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  tableLabel: { fontSize: 26, fontWeight: 400, color: "#5f4a28" },
  searchBox: {
    background: "#fff", border: "none", borderRadius: 20, padding: "4px 16px",
    fontSize: 16, fontFamily: "'Libre Bodoni', serif", color: "rgba(95,74,40,0.5)",
    width: 180, outline: "none",
  },

  // Table
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 18, fontWeight: 400, color: "#5f4a28", padding: "8px 12px", borderBottom: "1px solid #c8b89a" },
  td: { fontSize: 16, color: "rgba(95,74,40,0.8)", padding: "12px 12px", borderBottom: "1px solid #e0d5c5" },
  thActions: { textAlign: "right", fontSize: 18, fontWeight: 400, color: "#5f4a28", padding: "8px 12px", borderBottom: "1px solid #c8b89a" },
  tdActions: { textAlign: "right", padding: "12px 12px", borderBottom: "1px solid #e0d5c5" },

  editBtn: {
    background: "#fff", border: "none", borderRadius: 20, padding: "4px 16px",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, color: "#5f4a28",
    cursor: "pointer", marginRight: 8,
  },
  deleteBtn: {
    background: "#fff", border: "none", borderRadius: 20, padding: "4px 16px",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, color: "#e54949",
    cursor: "pointer",
  },

  // Pagination
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "20px 0 8px" },
  pageBtn: (active) => ({
    width: 36, height: 32, borderRadius: 10, border: "none", cursor: "pointer",
    background: active ? "#ecdcc2" : "#fff",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, color: "rgba(95,74,40,0.8)",
  }),
  pageNav: {
    border: "none", background: "none", cursor: "pointer",
    fontFamily: "'Libre Bodoni', serif", fontSize: 16, color: "rgba(95,74,40,0.6)",
  },
  showing: { fontSize: 15, color: "rgba(95,74,40,0.8)", marginTop: 4 },
};