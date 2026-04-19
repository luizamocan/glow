import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import Sidebar from "../components/Sidebar";
import { s, AVATAR_HEADER } from "./StatisticsPage.styles";

Chart.register(...registerables);



const getDurationBucket = (dur) => {
  const mins = parseInt(dur);
  if (mins <= 30) return "0-30 min";
  if (mins <= 60) return "30-60 min";
  return "60+ min";
};

const getPriceTier = (price) => {
  const val = typeof price === "string" ? parseInt(price.replace("$", "")) : price;
  if (val <= 40) return "Low";
  if (val <= 80) return "Medium";
  return "High";
};

const getRating = (price) => {
  const val = typeof price === "string" ? parseInt(price.replace("$", "")) : price;
  if (val <= 40) return 3;
  if (val <= 80) return 4;
  return 5;
};

function StarRating({ rating, max = 5 }) {
  return (
    <span style={{ color: "#c8a96e", fontSize: 18, letterSpacing: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#c8a96e" : "#ddd" }}>★</span>
      ))}
    </span>
  );
}


function PieChart({ services }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    services.forEach(sv => {
      const tier = getPriceTier(sv.price);
      if (tier === "Low") counts.low++;
      else if (tier === "Medium") counts.medium++;
      else counts.high++;
    });

    if (chartRef.current) chartRef.current.destroy();
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels: ["Low (≤$40)", "Medium ($41-$80)", "High (>$80)"],
        datasets: [{
          data: [counts.low, counts.medium, counts.high],
          backgroundColor: ["#ecdcc2", "rgba(163,135,91,0.74)", "#f2cdcd"],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { font: { family: "'Libre Bodoni', serif", size: 13 }, color: "#5f4a28" } },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [services]);

  return <canvas ref={canvasRef} />;
}

function DurationBarChart({ services }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const counts = { "0-30 min": 0, "30-60 min": 0, "60+ min": 0 };
    services.forEach(sv => counts[getDurationBucket(sv.duration)]++);

    if (chartRef.current) chartRef.current.destroy();
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: ["#ecdcc2", "rgba(163,135,91,0.74)", "#f2cdcd"],
          borderRadius: 4, borderWidth: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'Libre Bodoni', serif" }, color: "#5f4a28" }, grid: { color: "rgba(95,74,40,0.1)" } },
          x: { ticks: { font: { family: "'Libre Bodoni', serif" }, color: "#5f4a28" }, grid: { display: false } },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [services]);

  return <canvas ref={canvasRef} />;
}

function FrequencyBarChart({ services }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const counts = { "Low": 0, "Medium": 0, "High": 0 };
    services.forEach(sv => counts[getPriceTier(sv.price)]++);

    if (chartRef.current) chartRef.current.destroy();
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Low Price", "Medium Price", "High Price"],
        datasets: [{
          data: [counts.Low, counts.Medium, counts.High],
          backgroundColor: ["#ecdcc2", "rgba(163,135,91,0.74)", "#f2cdcd"],
          borderRadius: 4, borderWidth: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'Libre Bodoni', serif" }, color: "#5f4a28" }, grid: { color: "rgba(95,74,40,0.1)" } },
          x: { ticks: { font: { family: "'Libre Bodoni', serif" }, color: "#5f4a28" }, grid: { display: false } },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [services]);

  return <canvas ref={canvasRef} />;
}

function RankingTable({ services }) {
  const sorted = [...services]
    .sort((a, b) => getRating(b.price) - getRating(a.price))
    .slice(0, 5);

  return (
    <div style={{ padding: "8px 0" }}>
      {sorted.map((sv, i) => (
        <div key={sv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: "1px solid rgba(95,74,40,0.1)" }}>
          <span style={{ fontFamily: "'Libre Bodoni', serif", fontSize: 18, color: "#5f4a28", fontWeight: 700 }}>
            {i + 1}. {sv.name}
          </span>
          <StarRating rating={getRating(sv.price)} />
        </div>
      ))}
    </div>
  );
}

function TabularView({ services }) {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(services.length / perPage));
  const displayed = services.slice((page - 1) * perPage, page * perPage);

  const tierColor = { Low: "#ecdcc2", Medium: "rgba(163,135,91,0.3)", High: "#f2cdcd" };

  return (
    <div style={s.tabularCard}>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Service Name</th>
            <th style={s.th}>Price Tier</th>
            <th style={s.th}>Pricing & Duration</th>
            <th style={s.th}>Frequency Index</th>
            <th style={s.th}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((sv) => {
            const tier = getPriceTier(sv.price);
            const price = typeof sv.price === "string" ? parseInt(sv.price.replace("$", "")) : sv.price;
            const freq = Math.max(5, Math.round(50 / (price || 1) * 10));
            return (
              <tr key={sv.id}>
                <td style={s.td}>{sv.name}</td>
                <td style={s.td}>
                  <span style={{ background: tierColor[tier], borderRadius: 12, padding: "2px 14px", fontFamily: "'Libre Bodoni', serif", fontSize: 14, color: "#5f4a28" }}>
                    {tier}
                  </span>
                </td>
                <td style={s.td}>${price} / {sv.duration} min</td>
                <td style={s.td}>{freq}</td>
                <td style={s.td}><StarRating rating={getRating(sv.price)} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={s.pagination}>
        <button style={s.pageNav} disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} style={s.pageBtn(page === i + 1)} onClick={() => setPage(i + 1)}>{i + 1}</button>
        ))}
        <button style={s.pageNav} disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next ›</button>
      </div>
    </div>
  );
}



export default function StatisticsPage({ onNavigate, onLogout, services }) {
  console.log("StatisticsPage received services:", services);
  const [view, setView] = useState("chart");

  const handleStartGenerator = async () => {
    try {
      console.log("Requesting generator start...");
      const response = await fetch("http://localhost:5000/api/admin/start-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        alert("Generator Started!");
      } else {
        const err = await response.json();
        alert("Server said: " + err.error);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      alert("Check console - server unreachable");
    }
  };

  const handleStopGenerator = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/stop-gen", { method: "POST" });
      if (response.ok) alert("Faker Generator Stopped.");
    } catch (e) {
      alert("Error: Server unreachable.");
    }
  };

  
  const chartKey = services.length;

  return (
    <div style={s.page} className="page-enter">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');`}</style>
      <Sidebar activePage="statistics" onNavigate={onNavigate} onLogout={onLogout} />

      <main style={s.main} className="main-content">
        <div style={s.topBar}>
          <div style={s.pageTitle}>Admin Dashboard</div>
          <div style={s.userCard}>
            <img src={AVATAR_HEADER} alt="Admin" style={s.userAvatar} />
            <div>
              <div style={s.userName}>Luiza Mocan</div>
              <div style={s.userRole}>Admin</div>
            </div>
          </div>
        </div>

        <div style={s.sectionTitle}>Business Analytics</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={s.toggleRow}>
            <button
              style={view === "chart" ? s.toggleActive : s.toggleInactive}
              onClick={() => setView("chart")}
            >
              📈 Chart View
            </button>
            <button
              style={view === "tabular" ? s.toggleActive : s.toggleInactive}
              onClick={() => setView("tabular")}
            >
              📋 Tabular View
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleStartGenerator}
              style={{ background: '#5f4a28', color: '#ffe5bd', padding: '10px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'Libre Bodoni', serif" }}
            >
              ▶ Start Faker
            </button>
            <button
              onClick={handleStopGenerator}
              style={{ background: '#fff', color: '#5f4a28', padding: '10px 18px', borderRadius: 20, border: '1.5px solid #5f4a28', cursor: 'pointer', fontWeight: 700, fontFamily: "'Libre Bodoni', serif" }}
            >
              ■ Stop Faker
            </button>
          </div>
        </div>

        {services.length === 0 ? (
          <div style={{ textAlign: "center", padding: 50, color: "#5f4a28", opacity: 0.6 }}>
            No data available. Add services or start the Faker generator.
          </div>
        ) : view === "chart" ? (
          <div style={s.chartsGrid}>
            {/* ✅ key={chartKey} forces full remount of each chart when services.length changes,
                preventing the canvas ref race condition on destroy/recreate. */}
            <div style={s.chartCard}>
              <div style={s.chartTitle}>Price Tier Distribution</div>
              <div style={{ height: 200 }}>
                <PieChart key={`pie-${chartKey}`} services={services} />
              </div>
            </div>
            <div style={s.chartCard}>
              <div style={s.chartTitle}>Service Durations</div>
              <div style={{ height: 200 }}>
                <DurationBarChart key={`dur-${chartKey}`} services={services} />
              </div>
            </div>
            <div style={s.chartCard}>
              <div style={s.chartTitle}>Pricing Frequency</div>
              <div style={{ height: 200 }}>
                <FrequencyBarChart key={`freq-${chartKey}`} services={services} />
              </div>
            </div>
            <div style={s.chartCard}>
              <div style={s.chartTitle}>Top Rated Services</div>
              <RankingTable key={`rank-${chartKey}`} services={services} />
            </div>
          </div>
        ) : (
          <TabularView services={services} />
        )}
      </main>
    </div>
  );
}