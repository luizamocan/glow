export const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
  modal: {
    background: "#d9d9d9", borderRadius: 20, padding: "40px 48px",
    width: 520, fontFamily: "'Libre Bodoni', serif",
  },
  title: { fontSize: 30, fontWeight: 400, color: "#5f4a28", marginBottom: 28 },
  label: { fontSize: 20, fontWeight: 400, color: "#5f4a28", marginBottom: 6, display: "block" },
  input: {
    width: "100%", height: 36, borderRadius: 20, border: "none",
    padding: "0 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box",
  },
  inputError: {
    width: "100%", height: 36, borderRadius: 20, border: "1.5px solid #e54949",
    padding: "0 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box",
  },
  textarea: {
    width: "100%", height: 60, borderRadius: 20, border: "none",
    padding: "10px 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box", resize: "none",
  },
  textareaError: {
    width: "100%", height: 60, borderRadius: 20, border: "1.5px solid #e54949",
    padding: "10px 14px", fontSize: 18, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", outline: "none", marginBottom: 4, boxSizing: "border-box", resize: "none",
  },
  errorText: { fontSize: 13, color: "#e54949", marginBottom: 12, marginLeft: 14 },
  footer: { display: "flex", justifyContent: "space-between", gap: 16, marginTop: 16 },
  btnCancel: {
    flex: 1, height: 45, borderRadius: 20, border: "none", background: "#fff",
    fontFamily: "'Libre Bodoni', serif", fontSize: 20, color: "#5f4a28", cursor: "pointer",
  },
  btnEdit: {
    flex: 1, height: 45, borderRadius: 20, border: "none", background: "#5f4a28",
    fontFamily: "'Libre Bodoni', serif", fontSize: 20, color: "#ffe5bd", cursor: "pointer",
  },
};