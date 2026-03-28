export const TRASH_IMG = "https://www.figma.com/api/mcp/asset/64ab8658-3415-4f86-8fd9-18279d3616d9";

export const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
  modal: {
    background: "#d9d9d9", borderRadius: 30, padding: "40px 60px",
    width: 600, textAlign: "center", fontFamily: "'Libre Bodoni', serif",
  },
  icon: { width: 60, height: 60, objectFit: "contain", marginBottom: 20 },
  text: { fontSize: 20, color: "#5f4a28", marginBottom: 32, lineHeight: 1.5 },
  footer: { display: "flex", justifyContent: "center", gap: 24 },
  btnDelete: {
    width: 148, height: 36, borderRadius: 20, border: "none", background: "#5f4a28",
    fontFamily: "'Libre Bodoni', serif", fontSize: 18, color: "#fff", cursor: "pointer",
  },
  btnCancel: {
    width: 148, height: 36, borderRadius: 20, border: "1.5px solid #5f4a28", background: "#fff",
    fontFamily: "'Libre Bodoni', serif", fontSize: 18, color: "#5f4a28", cursor: "pointer",
  },
};