const BG_IMAGE = "https://www.figma.com/api/mcp/asset/6ccd48e2-a0dc-415c-8cc0-eb94969fa8a0";

export const s = {
  page: {
    display: "flex", width: "100vw", height: "100vh",
    fontFamily: "'Libre Bodoni', serif", background: "#fff", overflow: "hidden",
  },
  left: {
    width: 654, minHeight: "100vh", flexShrink: 0,
    backgroundImage: `url(${BG_IMAGE})`,
    backgroundSize: "cover", backgroundPosition: "center",
  },
  right: {
    flex: 1, display: "flex", flexDirection: "column",
    padding: "40px 60px", overflowY: "auto",
  },
  title: { fontSize: 64, fontWeight: 400, color: "#5f4a28", marginBottom: 12, lineHeight: 1.1 },
  subtitle: { fontSize: 24, fontWeight: 700, color: "#5f4a28", marginBottom: 6 },
  tagline: { fontSize: 24, fontWeight: 700, color: "rgba(95,74,40,0.5)", marginBottom: 28 },
  label: { fontSize: 20, fontWeight: 700, color: "#5f4a28", marginBottom: 6, display: "block" },
  input: {
    width: "100%", height: 46, borderRadius: 20, border: "none",
    background: "#ecdcc2", padding: "0 16px", fontSize: 18,
    fontFamily: "'Libre Bodoni', serif", color: "#5f4a28",
    outline: "none", marginBottom: 20, boxSizing: "border-box",
  },
  hint: { fontSize: 14, color: "rgba(95,74,40,0.7)", marginTop: -14, marginBottom: 20 },
  createBtn: {
    width: "100%", height: 46, borderRadius: 20, border: "none",
    background: "#ecdcc2", fontFamily: "'Libre Bodoni', serif",
    fontSize: 20, fontWeight: 700, color: "#5f4a28",
    cursor: "pointer", marginTop: 8, marginBottom: 16, transition: "background 0.2s",
  },
  loginRow: { fontSize: 24, fontWeight: 700, color: "#5f4a28" },
  loginLink: { textDecoration: "underline", cursor: "pointer" },
};