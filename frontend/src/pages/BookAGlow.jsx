import React, { useState, useEffect, useRef, useCallback } from 'react';
import ClientSidebar from "../components/ClientSidebar";

import { API_BASE_URL } from "../config";
import { authHeaders } from "../api";
import { getServiceImage } from "../serviceImages";

const PAGE_LIMIT = 8;

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "'Libre Bodoni', serif" },
  main: { marginLeft: 341, flex: 1, padding: "0 40px 40px" },
  header: { marginTop: 40, marginBottom: 32 },
  title: { fontSize: 48, fontWeight: 700, color: "#5f4a28", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "rgba(95,74,40,0.7)" },
  tabs: { display: "flex", gap: 20, marginBottom: 32, borderBottom: "1px solid #e0d5c5", paddingBottom: 12 },
  tab: (active) => ({
    fontSize: 18, fontWeight: active ? 700 : 400, color: "#5f4a28",
    cursor: "pointer", opacity: active ? 1 : 0.6, transition: "0.2s",
    borderBottom: active ? "3px solid #5f4a28" : "3px solid transparent",
    paddingBottom: 8
  }),
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 },
  card: {
    background: "#faf3e8", borderRadius: 25, overflow: "hidden",
    border: "1px solid #e0d5c5", display: "flex", flexDirection: "column",
    transition: "transform 0.2s", cursor: "default"
  },
  cardImg: { width: "100%", height: 180, objectFit: "cover" },
  cardContent: { padding: 20, flex: 1, display: "flex", flexDirection: "column" },
  cardName: { fontSize: 22, fontWeight: 700, color: "#5f4a28", marginBottom: 6 },
  cardPrice: { fontSize: 18, fontWeight: 700, color: "#5f4a28", marginBottom: 12 },
  bookBtn: {
    background: "#5f4a28", color: "#ffe5bd", border: "none", borderRadius: 20,
    padding: "10px 0", fontFamily: "'Libre Bodoni', serif", fontSize: 16,
    fontWeight: 700, cursor: "pointer", marginTop: "auto"
  },
  searchBar: {
    width: "100%", maxWidth: 400, height: 45, borderRadius: 20,
    border: "1px solid #e0d5c5", background: "#faf3e8",
    padding: "0 20px", fontSize: 16, color: "#5f4a28",
    outline: "none", marginBottom: 30, fontFamily: "'Libre Bodoni', serif"
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 },
  modal: { background: "#d9d9d9", borderRadius: 25, padding: "40px", width: 450, fontFamily: "'Libre Bodoni', serif" },
  modalTitle: { fontSize: 28, color: "#5f4a28", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%", padding: "12px", borderRadius: 15, border: "none",
    marginBottom: 15, fontSize: 16, fontFamily: "'Libre Bodoni', serif",
    color: "#5f4a28", boxSizing: "border-box"
  },
  modalFooter: { display: "flex", gap: 12, marginTop: 10 },
  confirmBtn: {
    flex: 2, padding: "12px", background: "#5f4a28", color: "#ffe5bd",
    border: "none", borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: "pointer"
  },
  cancelBtn: {
    flex: 1, padding: "12px", background: "#fff", color: "#5f4a28",
    border: "1.5px solid #5f4a28", borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: "pointer", textAlign: "center"
  },
  loader: {
    textAlign: "center", padding: "32px 0", color: "#5f4a28",
    opacity: 0.6, fontFamily: "'Libre Bodoni', serif", fontSize: 16
  }
};

function StarRating({ rating = 5 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#c8a96e" : "#ddd", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

const generateTimes = () => {
  const times = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const m = min === 0 ? '00' : min;
      times.push(`${h}:${m} ${ampm}`);
      if (hour === 20) break;
    }
  }
  return times;
};

export default function BookAGlow({ onNavigate, user, onLogout, initialService, onBook ,refreshKey}) {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [bookingService, setBookingService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Prefetch cache: { [pageNum]: [services] }
  const prefetchCache = useRef({});
  // Sentinel div at the bottom — IntersectionObserver watches this
  const loaderRef = useRef(null);
  const searchTimeout = useRef(null);
  // Track current page in a ref so the observer always sees latest value
  const pageRef = useRef(1);

  const timeOptions = generateTimes();

  // ── Fetch a single page from the server ───────────────────────
  const fetchPage = useCallback(async (pageNum, search) => {
    const res = await fetch(
      `${API_BASE_URL}/api/services?page=${pageNum}&limit=${PAGE_LIMIT}&search=${search}`,
      { headers: authHeaders(user) }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json(); // { data, pagination }
  }, [user]);

  // ── Prefetch next page silently into cache ─────────────────────
  const prefetchNext = useCallback(async (currentPage, search) => {
    const next = currentPage + 1;
    if (prefetchCache.current[next]) return; // already cached
    try {
      const result = await fetchPage(next, search);
      if (result.data?.length > 0) {
        prefetchCache.current[next] = result;
        console.log(`[Prefetch] Cached page ${next}`);
      }
    } catch (_) {
      // silent — prefetch failure is not critical
    }
  }, [fetchPage]);

  // ── Load a page (use cache if available) ──────────────────────
  const loadPage = useCallback(async (pageNum, search, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      let result;
      if (prefetchCache.current[pageNum]) {
        result = prefetchCache.current[pageNum];
        console.log(`[Cache hit] Page ${pageNum}`);
      } else {
        result = await fetchPage(pageNum, search);
      }

      const { data, pagination } = result;
      setServices(prev => reset ? data : [...prev, ...data]);
      setHasNextPage(pagination.hasNextPage ?? pageNum < pagination.totalPages);
      setTotal(pagination.total);

      // Prefetch next page immediately
      prefetchNext(pageNum, search);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, fetchPage, prefetchNext]);

  // ── Reset and reload when search changes ──────────────────────
  useEffect(() => {
    prefetchCache.current = {};
    pageRef.current = 1;
    setPage(1);
    setServices([]);
    setHasNextPage(true);
    loadPage(1, searchTerm, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── IntersectionObserver: trigger next page on scroll ─────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          setPage(nextPage);
          loadPage(nextPage, searchTerm);
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = loaderRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, [hasNextPage, loading, searchTerm, loadPage]);

  // ── Debounced search input ─────────────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearchTerm(val), 400);
  };

  // ── Open booking modal if navigated here with initialService ──
  useEffect(() => {
    if (initialService) {
      setBookingService(initialService);
      onNavigate("book", null);
    }
  }, [initialService]);

  const handleConfirm = () => {
    if (!date || !time) return alert("Please select both a date and time.");
    onBook({
      service: bookingService.name,
      serviceId: bookingService.id,
      date,
      time,
      price: bookingService.price,
    });
    setBookingService(null);
    setDate("");
    setTime("");
    onNavigate("book", null);
    onNavigate("history");
  };

  useEffect(() => {
  if (refreshKey === 0) return; // skip initial render
  prefetchCache.current = {};
  pageRef.current = 1;
  setPage(1);
  setServices([]);
  setHasNextPage(true);
  loadPage(1, searchTerm, true);
}, [refreshKey]);

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .book-main {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 20px 16px 92px !important;
          }
          .book-header { margin-top: 8px !important; margin-bottom: 22px !important; }
          .book-title { font-size: 34px !important; line-height: 1.1 !important; }
          .book-subtitle { font-size: 16px !important; }
          .book-search {
            max-width: none !important;
            height: 48px !important;
            border-radius: 16px !important;
            margin-bottom: 22px !important;
          }
          .book-tabs {
            gap: 10px !important;
            overflow-x: auto !important;
            margin-bottom: 22px !important;
            padding-bottom: 10px !important;
          }
          .book-tab {
            flex: 0 0 auto !important;
            font-size: 16px !important;
            padding: 0 4px 8px !important;
          }
          .book-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .book-card { border-radius: 18px !important; }
          .book-card-img { height: 150px !important; }
          .book-card-content { padding: 16px !important; }
          .book-card-name { font-size: 21px !important; }
          .book-modal-overlay {
            align-items: flex-end !important;
            padding: 14px !important;
          }
          .book-modal {
            width: 100% !important;
            max-width: none !important;
            padding: 24px 18px !important;
            border-radius: 22px !important;
          }
          .book-modal-title { font-size: 24px !important; }
          .book-modal-footer { flex-direction: column-reverse !important; }
        }
      `}</style>
      <ClientSidebar activePage="book" onNavigate={onNavigate} user={user} onLogout={onLogout} />

      <main style={s.main} className="book-main">
        <header style={s.header} className="book-header">
          <h1 style={s.title} className="book-title">Book Your Glow</h1>
          <p style={s.subtitle} className="book-subtitle">Treat yourself to a signature experience.</p>
        </header>

        <input
          type="text"
          placeholder="Search for a service..."
          style={s.searchBar}
          className="book-search"
          onChange={handleSearchChange}
        />

        <div style={s.tabs} className="book-tabs">
          {["All", "Skin", "Hair", "Body"].map(cat => (
            <div key={cat} style={s.tab(activeTab === cat)} className="book-tab" onClick={() => setActiveTab(cat)}>{cat}</div>
          ))}
        </div>

        <div style={s.grid} className="book-grid">
          {services.map(sv => (
            <div key={sv.id} style={s.card} className="book-card">
              <img src={getServiceImage(sv)} alt={sv.name} style={s.cardImg} className="book-card-img" />
              <div style={s.cardContent} className="book-card-content">
                <h3 style={s.cardName} className="book-card-name">{sv.name}</h3>
                <StarRating />
                <div style={s.cardPrice}>${sv.price} • {sv.duration} min</div>
                <button style={s.bookBtn} onClick={() => setBookingService(sv)}>Book Appointment</button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Infinite scroll sentinel ── */}
        <div ref={loaderRef} style={s.loader}>
          {loading && "Loading more services..."}
          {!loading && !hasNextPage && services.length > 0 && `All ${total} services loaded ✓`}
        </div>

        {bookingService && (
          <div style={s.overlay} className="book-modal-overlay" onClick={() => setBookingService(null)}>
            <div style={s.modal} className="book-modal" onClick={e => e.stopPropagation()}>
              <h2 style={s.modalTitle} className="book-modal-title">Book {bookingService.name}</h2>

              <label style={{ display: 'block', marginBottom: 5, color: '#5f4a28', fontWeight: 700 }}>Select Date</label>
              <input
                type="date"
                style={s.input}
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />

              <label style={{ display: 'block', marginBottom: 5, color: '#5f4a28', fontWeight: 700 }}>Select Time</label>
              <select
                style={s.input}
                value={time}
                onChange={e => setTime(e.target.value)}
              >
                <option value="">Choose a time...</option>
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div style={s.modalFooter} className="book-modal-footer">
                <button style={s.cancelBtn} onClick={() => setBookingService(null)}>Cancel</button>
                <button style={s.confirmBtn} onClick={handleConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
