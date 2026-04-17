import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AddServiceModal from "../components/AddServiceModal";
import EditServiceModal from "../components/EditServiceModal";
import DeleteServiceModal from "../components/DeleteServiceModal";
import ServiceDetailModal from "../components/ServiceDetailModal";
import Toast, { useToast } from "../components/Toast";
import { s, AVATAR_HEADER } from "./ServicesPage.styles";

export default function ServicesPage({ onNavigate, services, setServices, onLogout }) {
  const { toast, showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = services.filter(sv =>
    sv.name.toLowerCase().includes(search.toLowerCase())
  );
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const displayed = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAdd = (form) => {
    setServices([...services, { ...form, id: Date.now() }]);
    showToast("Service added successfully!");
  };
  const handleEdit = (form) => {
    setServices(services.map(sv => sv.id === form.id ? form : sv));
    showToast("Service updated successfully!");
  };
  const handleDelete = () => {
    setServices(services.filter(sv => sv.id !== deleteTarget.id));
    showToast("Service deleted.", "info");
  };

  return (
    <div style={s.page} className="page-enter">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');`}</style>
      <Sidebar activePage="services" onNavigate={onNavigate} onLogout={onLogout} />

      <main style={s.main} className="main-content">
        {/* Hero banner */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 180, marginTop: 20, marginBottom: 24 }}>
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80"
            alt="Salon banner"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(95,74,40,0.7) 0%, rgba(95,74,40,0.2) 100%)",
            display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 36px",
          }}>
            <div style={{ fontSize: 13, color: "rgba(255,229,189,0.85)", fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>ADMIN DASHBOARD</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#ffe5bd", lineHeight: 1.15, fontFamily: "'Libre Bodoni', serif" }}>Services Management</div>
          </div>
          <div style={{
            position: "absolute", top: 16, right: 16,
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(250,243,232,0.9)", borderRadius: 20, padding: "5px 12px",
          }}>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Admin" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#5f4a28", fontFamily: "'Libre Bodoni', serif" }}>Luiza Mocan</div>
              <div style={{ fontSize: 11, color: "#5f4a28", opacity: 0.7, fontFamily: "'Libre Bodoni', serif" }}>Admin</div>
            </div>
          </div>
        </div>

        {/* Section heading */}
        <div style={s.sectionRow}>
          <div style={s.sectionTitle}>Services Management</div>
          <button style={s.addBtn} onClick={() => setShowAdd(true)}>＋ Add Service</button>
        </div>

        {/* Table card */}
        <div style={s.tableCard}>
          <div style={s.tableTop}>
            <span style={s.tableLabel}>Services</span>
            <input
              style={s.searchBox}
              placeholder="Search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Service</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Duration</th>
                <th style={s.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(sv => (
                <tr key={sv.id} className="table-row">
                  <td style={s.td}>{sv.name}</td>
                  <td style={s.td}>{sv.price}</td>
                  <td style={s.td}>{sv.duration}</td>
                  <td style={s.tdActions}>
                    <button style={s.editBtn} onClick={() => setEditTarget(sv)}>Edit</button>
                    <button style={s.deleteBtn} onClick={() => setDeleteTarget(sv)}>Delete</button>
                    <button onClick={() => setDetailTarget(sv)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f4a28", fontSize: 18, marginLeft: 8, padding: "2px 6px", borderRadius: 8 }}>•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={s.pagination}>
            <button style={s.pageNav} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} style={s.pageBtn(page === i + 1)} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button style={s.pageNav} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next ›</button>
          </div>
          <div style={s.showing}>Showing {displayed.length} of {filtered.length} services</div>
        </div>
      </main>

      <Toast message={toast?.message} type={toast?.type} />
      {showAdd && <AddServiceModal onClose={() => setShowAdd(false)} onAdd={handleAdd} services={services} />}
      {editTarget && <EditServiceModal onClose={() => setEditTarget(null)} service={editTarget} onSave={handleEdit} services={services} />}
      {deleteTarget && <DeleteServiceModal onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {detailTarget && <ServiceDetailModal service={detailTarget} onClose={() => setDetailTarget(null)} onEdit={(sv) => { setDetailTarget(null); setEditTarget(sv); }} onDelete={(sv) => { setDetailTarget(null); setDeleteTarget(sv); }} />}
    </div>
  );
}
