// Fresh lotus image URL from Figma
const LOTUS_IMG = "https://www.figma.com/api/mcp/asset/dda7a683-ccab-4b42-a45f-a3175e5702ad";

export default function Logo({ size = 138 }) {
  const scale = size / 138;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Lotus icon */}
      <div style={{ position: "absolute", top: "22.92%", left: "9.37%", right: "9.38%", bottom: "22.92%" }}>
        <img alt="Lotus logo" src={LOTUS_IMG} style={{ display: "block", width: "100%", height: "100%" }} />
      </div>
      {/* Brand name */}
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
