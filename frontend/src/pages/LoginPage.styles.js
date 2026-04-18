import loginPhoto from "../assets/login_option.jpg";

export const s = {
  page: {
    display: "flex", width: "100vw", height: "100vh",
    fontFamily: "'Libre Bodoni', serif", background: "#fff", overflow: "hidden",
  },
  left: {
    width: 654, minHeight: "100vh", flexShrink: 0,
    backgroundImage: `url(${loginPhoto})`,
    backgroundSize: "cover", backgroundPosition: "center",
  },
  right: {
    flex: 1, display: "flex", flexDirection: "column",
    padding: "0 60px", justifyContent: "center", overflowY: "auto",
  },
  title: { fontSize: 64, fontWeight: 400, color: "#5f4a28", marginBottom: 12, lineHeight: 1.1 },
  subtitle: { fontSize: 24, fontWeight: 700, color: "#5f4a28", marginBottom: 6 },
  tagline: { fontSize: 24, fontWeight: 700, color: "rgba(95,74,40,0.75)", marginBottom: 36 },
  label: { fontSize: 20, fontWeight: 700, color: "#5f4a28", marginBottom: 6, display: "block" },
  input: {
    width: "100%", height: 46, borderRadius: 20, border: "none",
    background: "#ecdcc2", padding: "0 16px", fontSize: 18,
    fontFamily: "'Libre Bodoni', serif", color: "#5f4a28",
    outline: "none", marginBottom: 20, boxSizing: "border-box",
  },
  hint: { fontSize: 14, color: "rgba(95,74,40,0.7)", marginTop: -14, marginBottom: 20 },
  loginBtn: {
    width: "100%", height: 46, borderRadius: 20, border: "none",
    background: "#ecdcc2", fontFamily: "'Libre Bodoni', serif",
    fontSize: 20, fontWeight: 700, color: "#5f4a28",
    cursor: "pointer", marginBottom: 12, marginTop: 20, transition: "background 0.2s",
  },
  forgotRow: { textAlign: "right", marginBottom: 40 },
  forgot: { fontSize: 20, fontWeight: 700, color: "#5f4a28", textDecoration: "underline", cursor: "pointer" },
  signupRow: { fontSize: 24, fontWeight: 700, color: "#5f4a28" },
  signupLink: { textDecoration: "underline", cursor: "pointer" },
};