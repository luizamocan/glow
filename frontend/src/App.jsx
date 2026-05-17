import { useEffect, useState } from "react";
import GlowAndShine from "./pages/GlowAndShine";
import ServicesPage from "./pages/ServicesPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import StatisticsPage from "./pages/StatisticsPage";
import ClientDashboard from "./pages/ClientDashboard";
import { trackPageVisit, saveLastUser, incrementVisitCount } from "./cookies";
import BookAGlow from "./pages/BookAGlow"; 
import GlowHistory from "./pages/GlowHistory";
import ProfilePage from "./pages/ProfilePage";
import SecurityLogsPage from "./pages/SecurityLogsPage";
import ChatWidget from "./components/ChatWidget";
import { authHeaders } from "./api";
import { API_BASE_URL, WS_BASE_URL } from "./config";

const INITIAL_SERVICES = [
  { id: 1, name: "Facial",          price: "$50",  duration: "60 minutes",  description: "Deep skin cleansing treatment",              image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" },
  { id: 2, name: "Haircut",         price: "$35",  duration: "45 minutes",  description: "Precision haircut & styling",                image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=80" },
  { id: 3, name: "Manicure",        price: "$30",  duration: "90 minutes",  description: "Full manicure service",                      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80" },
  { id: 4, name: "Spa Treatment",   price: "$100", duration: "120 minutes", description: "Full body spa relaxation",                   image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { id: 5, name: "Pedicure",        price: "$40",  duration: "60 minutes",  description: "Full pedicure with nail polish",             image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&q=80" },
  { id: 6, name: "Eyebrow Shaping", price: "$25",  duration: "30 minutes",  description: "Professional eyebrow threading and shaping", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80" },
  { id: 7, name: "Hair Coloring",   price: "$80",  duration: "90 minutes",  description: "Full hair coloring with premium products",   image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
  { id: 8, name: "Deep Massage",    price: "$70",  duration: "75 minutes",  description: "Relaxing full body deep tissue massage",     image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&q=80" },
];


export default function App() {
  const [page, setPage] = useState("home");
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [appointments, setAppointments] = useState([
  { id: 1, service: "Manicure", date: "2024-03-10", time: "11:15 AM", price: "$30", status: "Completed", rating: 5, userEmail: "client@test.com" },
]);
  const [wsRefreshKey, setWsRefreshKey] = useState(0);
  const navigate = (p,data = null) => {
    trackPageVisit(p);
    if (data) setSelectedService(data);
    setPage(p);
  }

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    saveLastUser(user.email);
    incrementVisitCount();
    if (user.role === "admin") navigate("services");
    else navigate("client-home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("home");
  };



const addAppointment = async (newApp) => {
  const appointmentData = {
    ...newApp,
    id: Date.now(), 
    price: typeof newApp.price === 'string' ? parseInt(newApp.price.replace('$', '')) : newApp.price,
    userEmail: currentUser.email,
    status: "Upcoming"
  };


  setAppointments(prev => [...prev, appointmentData]);

  try {
   
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: "POST",
      headers: authHeaders(currentUser, { "Content-Type": "application/json" }),
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) throw new Error("Server unreachable");
    
    console.log("Sync Successful: Appointment saved to server.");
  } catch (error) {
    console.warn("Server unreachable. Saving to offline queue...");
    
    const offlineQueue = JSON.parse(localStorage.getItem("offline_glows") || "[]");
    offlineQueue.push(appointmentData);
    localStorage.setItem("offline_glows", JSON.stringify(offlineQueue));
    
    alert("You are offline! Your booking is saved locally and will sync when you reconnect.");
  }
};

const cancelAppointment = async (id) => {
  if (!window.confirm("Are you sure you want to cancel this glow?")) return;


  setAppointments(prev => prev.filter(app => app.id !== id));

  if (navigator.onLine) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
        headers: authHeaders(currentUser),
      });
      if (!response.ok) throw new Error("Server error");
    } catch (error) {
      queueOfflineAction({ type: 'DELETE', id });
    }
  } else {
    queueOfflineAction({ type: 'DELETE', id });
  }
};


const queueOfflineAction = (action) => {
  const queue = JSON.parse(localStorage.getItem("offline_glows") || "[]");
  queue.push(action);
  localStorage.setItem("offline_glows", JSON.stringify(queue));
  alert("Offline: This cancellation will sync when you are back online.");
};
useEffect(() => {
  const loadInitialServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/services?page=1&limit=1000`);
      const result = await res.json();
      if (res.ok && result.data?.length > 0) {
        setServices(result.data);
      }
    } catch (_) {
      // server unreachable, keep INITIAL_SERVICES as fallback
    }
  };
  loadInitialServices();
}, []);

useEffect(() => {
  const socket = new WebSocket(WS_BASE_URL);
  socket.onmessage = (event) => {
    const data=JSON.parse(event.data);
    if(data.type === "DATA_UPDATED") {
      console.log("Received real-time update from server");
      setServices(prev => {
        if (prev.find(s => s.id === data.payload.id)) return prev;
        return [...prev, data.payload];
      });
      setWsRefreshKey(k => k + 1);
    }
  };

  const syncOfflineData = async () => {
    if (!navigator.onLine) return;

    const appQueue = JSON.parse(localStorage.getItem("offline_glows") || "[]");
    
    if (appQueue.length > 0) {
      console.log(`Syncing ${appQueue.length} offline appointments...`);
      for (const action of appQueue) {
        try {
          if (action.type === 'DELETE') {
            await fetch(`${API_BASE_URL}/api/appointments/${action.id}`, {
              method: "DELETE",
              headers: authHeaders(currentUser),
            });
          } else {
            await fetch(`${API_BASE_URL}/api/appointments`, {
              method: "POST",
              headers: authHeaders(currentUser, { "Content-Type": "application/json" }),
              body: JSON.stringify(action),
            });
          }
        } catch (err) {
          console.error("Appointment sync failed. Server might still be unreachable.");
          return; 
        }
      }
      localStorage.removeItem("offline_glows");
      alert("Your offline bookings have been synchronized!");
    }

  
    const svcQueue = JSON.parse(localStorage.getItem("offline_services") || "[]");
    
    if (svcQueue.length > 0) {
      console.log(`Syncing ${svcQueue.length} offline admin changes...`);
      for (const action of svcQueue) {
        try {
          let url = `${API_BASE_URL}/api/services`;
          let options = { headers: authHeaders(currentUser, { "Content-Type": "application/json" }) };

          if (action.type === 'ADD_SERVICE') {
            options.method = "POST";
            options.body = JSON.stringify(action.data);
          } 
          else if (action.type === 'EDIT_SERVICE') {
            options.method = "PUT";
            url += `/${action.data.id}`;
            options.body = JSON.stringify(action.data);
          } 
          else if (action.type === 'DELETE_SERVICE') {
            options.method = "DELETE";
            url += `/${action.id}`;
          }

          const res = await fetch(url, options);
          if (!res.ok) throw new Error("Sync failed");

        } catch (err) {
          console.error("Admin sync failed. Stopping batch.");
          return; 
        }
      }
      localStorage.removeItem("offline_services");
      alert("Admin service changes have been synchronized!");
    }
  };

 
  window.addEventListener("online", syncOfflineData);
  syncOfflineData();

  return () => {
      window.removeEventListener("online", syncOfflineData);
      socket.close();
    };
  }, [currentUser]);


  const withChat = (content) => (
    <>
      {content}
      {currentUser && <ChatWidget user={currentUser} />}
    </>
  );

  if (page === "login")       return <LoginPage      onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
  if (page === "signup")      return <SignUpPage     onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
  if (page === "services")    return withChat(<ServicesPage   onNavigate={navigate} services={services} setServices={setServices} onLogout={handleLogout} user={currentUser} />);
  if (page === "statistics")  return withChat(<StatisticsPage onNavigate={navigate} services={services} onLogout={handleLogout} user={currentUser} />);
  if (page === "security")  return withChat(<SecurityLogsPage onNavigate={navigate} onLogout={handleLogout} user={currentUser} />);
  if (page === "client-home") return withChat(<ClientDashboard onNavigate={navigate} user={currentUser} services={services} onLogout={handleLogout} />);
  if (page === "book") return withChat(<BookAGlow onNavigate={navigate} user={currentUser} services={services} onLogout={handleLogout} initialService={selectedService} onBook={addAppointment} refreshKey={wsRefreshKey} />);
  if (page === "history") return withChat(<GlowHistory onNavigate={navigate} user={currentUser}  onLogout={handleLogout} appointments={appointments} setAppointments={setAppointments} cancelAppointment={cancelAppointment}/>);
  if (page === "profile") return withChat(<ProfilePage onNavigate={navigate} user={currentUser} appointments={appointments} onLogout={handleLogout} />);
  return <GlowAndShine
    onExplore={() => navigate("login")}
    onLogin={() => navigate("login")}
    onSignup={() => navigate("signup")}
  />;
}
