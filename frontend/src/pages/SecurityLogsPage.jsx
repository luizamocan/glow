import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../config";
import { authHeaders } from "../api";

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "28px 40px 40px" },
  title: { fontSize: 40, fontWeight: 700, color: "#5f4a28", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "rgba(95,74,40,0.72)", marginBottom: 24 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
  metric: { background: "#faf3e8", border: "1px solid #e3d4be", borderRadius: 8, padding: 18 },
  metricValue: { fontSize: 34, fontWeight: 700, color: "#5f4a28" },
  metricLabel: { fontSize: 14, color: "rgba(95,74,40,0.7)" },
  panel: { background: "#faf3e8", border: "1px solid #e3d4be", borderRadius: 8, padding: 18, marginBottom: 22 },
  panelTitle: { fontSize: 24, fontWeight: 700, color: "#5f4a28", marginBottom: 12 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #c8b89a", color: "#5f4a28", fontSize: 14 },
  td: { padding: "10px 12px", borderBottom: "1px solid #e0d5c5", color: "rgba(95,74,40,0.86)", fontSize: 13, verticalAlign: "top" },
  badge: (severity) => ({
    display: "inline-block",
    borderRadius: 8,
    padding: "3px 8px",
    fontWeight: 700,
    background: severity === "high" ? "#f2cdcd" : "#ecdcc2",
    color: "#5f4a28",
  }),
  refresh: {
    border: "none",
    borderRadius: 8,
    background: "#5f4a28",
    color: "#ffe5bd",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: 18,
  },
};

const formatDate = (value) => value ? new Date(value).toLocaleString() : "-";

export default function SecurityLogsPage({ onNavigate, onLogout, user }) {
  const [logs, setLogs] = useState([]);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const [logsResponse, observationsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/security/logs?limit=100`, { headers: authHeaders(user) }),
        fetch(`${API_BASE_URL}/api/security/observations`, { headers: authHeaders(user) }),
      ]);

      if (logsResponse.ok) setLogs(await logsResponse.json());
      if (observationsResponse.ok) setObservations(await observationsResponse.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={s.page} className="page-enter">
      <Sidebar activePage="security" onNavigate={onNavigate} onLogout={onLogout} />
      <main style={s.main} className="security-main">
        <h1 style={s.title}>Security Logs</h1>
        <p style={s.subtitle}>Persisted backend action logs and users currently placed under observation.</p>
        <button style={s.refresh} onClick={loadSecurityData}>{loading ? "Loading..." : "Refresh"}</button>

        <div style={s.grid} className="security-grid">
          <div style={s.metric}>
            <div style={s.metricValue}>{logs.length}</div>
            <div style={s.metricLabel}>Recent persisted actions</div>
          </div>
          <div style={s.metric}>
            <div style={s.metricValue}>{observations.length}</div>
            <div style={s.metricLabel}>Suspicious users under observation</div>
          </div>
        </div>

        <section style={s.panel} className="security-panel">
          <div style={s.panelTitle}>Observation List</div>
          <div style={s.tableWrap} className="responsive-table-card">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Identity</th>
                  <th style={s.th}>Group</th>
                  <th style={s.th}>Severity</th>
                  <th style={s.th}>Reason</th>
                  <th style={s.th}>Last Action</th>
                </tr>
              </thead>
              <tbody>
                {observations.length === 0 ? (
                  <tr><td style={s.td} colSpan="5">No suspicious users detected yet.</td></tr>
                ) : observations.map((item) => (
                  <tr key={item.id}>
                    <td style={s.td}>{item.userEmail || item.observedIdentity}</td>
                    <td style={s.td}>{item.groupId}</td>
                    <td style={s.td}><span style={s.badge(item.severity)}>{item.severity}</span></td>
                    <td style={s.td}>{item.reason}</td>
                    <td style={s.td}>{formatDate(item.lastActionAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={s.panel} className="security-panel">
          <div style={s.panelTitle}>Action Log</div>
          <div style={s.tableWrap} className="responsive-table-card">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Timestamp</th>
                  <th style={s.th}>User</th>
                  <th style={s.th}>Group</th>
                  <th style={s.th}>Action</th>
                  <th style={s.th}>Endpoint</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={s.td}>{formatDate(log.createdAt)}</td>
                    <td style={s.td}>{log.userEmail || log.userId || "anonymous"}</td>
                    <td style={s.td}>{log.groupId}</td>
                    <td style={s.td}>{log.actionType}</td>
                    <td style={s.td}>{log.method} {log.endpoint}</td>
                    <td style={s.td}>{log.statusCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
