import { useState } from "react";
import Logo from "../components/Logo";

import presentationView from "../assets/presentation-view.jpg";

export default function GlowAndShine({ onExplore, onLogin, onSignup }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "'Libre Bodoni', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400;0,700;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .btn {
          display: inline-block;
          background: #5f4a28;
          color: #ffe5bd;
          font-family: 'Libre Bodoni', serif;
          font-weight: 700;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-align: center;
        }
        .btn:hover {
          background: #7a6035;
          transform: translateY(-1px);
        }
        .btn:active {
          transform: translateY(0);
        }

        /* fade-up entrance */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease both; }

        @media (max-width: 768px) {
          .nav-buttons { gap: 8px !important; top: 14px !important; right: 14px !important; }
          .nav-btn { width: 130px !important; font-size: 16px !important; }
          .glass-card { left: 5% !important; width: 90% !important; padding: 32px 20px !important; top: 80px !important; }
          .title { font-size: 40px !important; }
          .subtitle { font-size: 18px !important; }
          .body-text { font-size: 16px !important; }
          .cta-btn { font-size: 18px !important; width: 220px !important; }
        }
      `}</style>

      <img
        src={presentationView}
        alt="Glow & Shine background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />


      <div
        style={{ position: "absolute", top: 16, left: 24 }}
        className="fade-up-1 logo-float"
      >
        <Logo size={100} />
      </div>

      <div
        className="nav-buttons"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          display: "flex",
          gap: 16,
        }}
      >
        <button
          className="btn nav-btn fade-up-1"
          style={{ width: 205, height: 35, fontSize: 24 }}
          onClick={onLogin}
        >
          Log in
        </button>
        <button
          className="btn nav-btn fade-up-1"
          style={{ width: 205, height: 35, fontSize: 24 }}
          onClick={onSignup}
        >
          Sign up
        </button>
      </div>

      <div
        className="glass-card"
        style={{
          position: "absolute",
          top: 115,
          left: "calc(50% - 346px)",  
          width: 693,
          height: 694,
          borderRadius: 105,
          background: "rgba(250, 243, 232, 0.40)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "56px 40px",
          textAlign: "center",
        }}
      >
        <h1
          className="title fade-up-2"
          style={{
            fontSize: 64,
            fontWeight: 400,
            color: "#000",
            lineHeight: "normal",
            marginBottom: 48,
          }}
        >
          Glow &amp; Shine
        </h1>

        <h2
          className="subtitle fade-up-3"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#000",
            lineHeight: "normal",
            marginBottom: 40,
          }}
        >
          Timeless Beauty, Modern Touch
        </h2>

        <p
          className="body-text fade-up-3"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#000",
            lineHeight: 1.45,
            marginBottom: 60,
          }}
        >
          Discover premium beauty services,<br />
          explore trusted professionals<br />
          and book appointments in just a few clicks.
        </p>

        <button
          className="btn cta-btn fade-up-4"
          style={{ width: 293, height: 45, fontSize: 24 }}
          onClick={onExplore}
        >
          Explore our website!
        </button>
      </div>
    </div>
  );
}
