import lotusIcon from "../assets/lotus.jpg"; 

export default function Logo({ size = 138 }) {
  const scale = size / 138;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "22.92%", left: "9.37%", right: "9.38%", bottom: "22.92%" }}>
        <img 
          alt="Lotus logo" 
          src={lotusIcon} 
          style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} 
        />
      </div>
      <p style={{
        position: "absolute", bottom: "1.45%", left: "-4.35%", right: "-3.62%",
        fontFamily: "'Libre Bodoni', serif", fontWeight: 700,
        fontSize: 24 * scale, color: "#5f4a28",
        whiteSpace: "nowrap", lineHeight: "normal",
        textAlign: "center", margin: 0,
      }}>
        Glow &amp; Shine
      </p>
    </div>
  );
}