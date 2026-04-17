export const BG_IMAGE = "https://www.figma.com/api/mcp/asset/0ebdec9a-9a96-4b4d-b628-f5982ce2e172";

export const glowStyles = `
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
  .btn:hover { background: #7a6035; transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }

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
`;