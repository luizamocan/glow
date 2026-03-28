const TRASH_IMG = "https://www.figma.com/api/mcp/asset/64ab8658-3415-4f86-8fd9-18279d3616d9";

const s = {
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

export default function DeleteServiceModal({ onClose, onConfirm }) {
  return (
    <div style={s.overlay} className="modal-overlay" onClick={onClose}>
      <div style={s.modal} className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={TRASH_IMG} alt="Delete" style={s.icon} />
        <p style={s.text}>Are you sure you want to<br />delete the service?</p>
        <div style={s.footer}>
          <button style={s.btnDelete} onClick={() => { onConfirm(); onClose(); }}>Delete</button>
          <button style={s.btnCancel} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
