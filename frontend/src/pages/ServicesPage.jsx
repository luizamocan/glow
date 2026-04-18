import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import AddServiceModal from "../components/AddServiceModal";
import EditServiceModal from "../components/EditServiceModal";
import DeleteServiceModal from "../components/DeleteServiceModal";
import ServiceDetailModal from "../components/ServiceDetailModal";
import Toast, { useToast } from "../components/Toast";
import { s } from "./ServicesPage.styles";

export default function ServicesPage({ onNavigate, onLogout, setServices: setGlobalServices }) {
  const { toast, showToast } = useToast();
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 4, total: 0, totalPages: 1 });
  
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // --- SYNC GLOBAL STATE (for StatisticsPage) ---
  const syncGlobalServices = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/services?page=1&limit=1000`);
      const result = await res.json();
      if (res.ok) setGlobalServices(result.data);
    } catch (_) {}
  }, [setGlobalServices]);

  // --- API CALLS ---

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/services?page=${page}&limit=4&search=${search}`);
      const result = await response.json();
      
      if (response.ok) {
        setServices(result.data);
        setPagination(result.pagination);
      } else {
        showToast(result.error || "Failed to fetch services", "error");
      }
    } catch (err) {
      showToast("Backend server is not reachable", "error");
    }
  }, [page, search, showToast]);

  useEffect(() => {
    fetchServices();
    syncGlobalServices();
  }, [fetchServices, syncGlobalServices]);

  const queueServiceAction = (action) => {
    const queue = JSON.parse(localStorage.getItem("offline_services") || "[]");
    queue.push(action);
    localStorage.setItem("offline_services", JSON.stringify(queue));
    showToast("Server unreachable. Action saved locally.", "info");
  };

  const handleAdd = async (form) => {
    const tempId = Date.now();
    const newService = { ...form, id: tempId };

    try {
      const response = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.status === 201) {
        showToast("Service added successfully!");
        setShowAdd(false);
        fetchServices();
        syncGlobalServices(); // ✅ keep StatisticsPage in sync
      } else {
        const result = await response.json();
        showToast(result.errors?.join(", ") || "Validation failed", "error");
      }
    } catch (err) {
      queueServiceAction({ type: 'ADD_SERVICE', data: form });
      setServices(prev => [...prev, newService]);
      setGlobalServices(prev => [...prev, newService]); // ✅ optimistic global update
      setShowAdd(false);
    }
  };

  const handleEdit = async (form) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        showToast("Service updated successfully!");
        setEditTarget(null);
        fetchServices();
        syncGlobalServices(); // ✅ keep StatisticsPage in sync
      } else {
        const result = await response.json();
        showToast(result.errors?.join(", ") || "Update failed", "error");
      }
    } catch (err) {
      queueServiceAction({ type: 'EDIT_SERVICE', data: form });
      setServices(prev => prev.map(s => s.id === form.id ? form : s));
      setGlobalServices(prev => prev.map(s => s.id === form.id ? form : s)); // ✅ optimistic global update
      setEditTarget(null);
    }
  };

  const handleDelete = async () => {
    const targetId = deleteTarget.id;
    try {
      const response = await fetch(`http://localhost:5000/api/services/${targetId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        showToast("Service deleted.", "info");
        setDeleteTarget(null);
        fetchServices();
        syncGlobalServices(); // ✅ keep StatisticsPage in sync
      }
    } catch (err) {
      queueServiceAction({ type: 'DELETE_SERVICE', id: targetId });
      setServices(prev => prev.filter(s => s.id !== targetId));
      setGlobalServices(prev => prev.filter(s => s.id !== targetId)); // ✅ optimistic global update
      setDeleteTarget(null);
    }
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

        <div style={s.sectionRow}>
          <div style={s.sectionTitle}>Services Management</div>
          <button style={s.addBtn} onClick={() => setShowAdd(true)}>＋ Add Service</button>
        </div>

        <div style={s.tableCard}>
          <div style={s.tableTop}>
            <span style={s.tableLabel}>Services</span>
            <input
              style={s.searchBox}
              placeholder="Search server-side..."
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
              {services.map(sv => (
                <tr key={sv.id} className="table-row">
                  <td style={s.td}>{sv.name}</td>
                  <td style={s.td}>${sv.price}</td>
                  <td style={s.td}>{sv.duration} min</td>
                  <td style={s.tdActions}>
                    <button style={s.editBtn} onClick={() => setEditTarget(sv)}>Edit</button>
                    <button style={s.deleteBtn} onClick={() => setDeleteTarget(sv)}>Delete</button>
                    <button onClick={() => setDetailTarget(sv)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f4a28", fontSize: 18, marginLeft: 8, padding: "2px 6px", borderRadius: 8 }}>•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={s.pagination}>
            <button 
              style={s.pageNav} 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button 
                key={i + 1} 
                style={s.pageBtn(page === i + 1)} 
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              style={s.pageNav} 
              disabled={page === pagination.totalPages}
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            >
              Next ›
            </button>
          </div>
          <div style={s.showing}>
            Showing {services.length} of {pagination.total} total services
          </div>
        </div>
      </main>

      <Toast message={toast?.message} type={toast?.type} />
      
      {showAdd && (
        <AddServiceModal 
          onClose={() => setShowAdd(false)} 
          onAdd={handleAdd} 
        />
      )}
      
      {editTarget && (
        <EditServiceModal 
          onClose={() => setEditTarget(null)} 
          service={editTarget} 
          onSave={handleEdit} 
        />
      )}
      
      {deleteTarget && (
        <DeleteServiceModal 
          onClose={() => setDeleteTarget(null)} 
          onConfirm={handleDelete} 
        />
      )}
      
      {detailTarget && (
        <ServiceDetailModal 
          service={detailTarget} 
          onClose={() => setDetailTarget(null)} 
          onEdit={(sv) => { setDetailTarget(null); setEditTarget(sv); }} 
          onDelete={(sv) => { setDetailTarget(null); setDeleteTarget(sv); }} 
        />
      )}
    </div>
  );
}