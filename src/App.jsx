import { useState } from "react";
import GlowAndShine from "./pages/GlowAndShine";
import ServicesPage from "./pages/ServicesPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import StatisticsPage from "./pages/StatisticsPage";
import ClientDashboard from "./pages/ClientDashboard";

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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "admin") setPage("services");
    else setPage("client-home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
  };

  if (page === "login")       return <LoginPage      onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />;
  if (page === "signup")      return <SignUpPage     onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />;
  if (page === "services")    return <ServicesPage   onNavigate={setPage} services={services} setServices={setServices} onLogout={handleLogout} />;
  if (page === "statistics")  return <StatisticsPage onNavigate={setPage} services={services} onLogout={handleLogout} />;
  if (page === "client-home") return <ClientDashboard onNavigate={setPage} user={currentUser} services={services} onLogout={handleLogout} />;

  return <GlowAndShine
    onExplore={() => setPage("login")}
    onLogin={() => setPage("login")}
    onSignup={() => setPage("signup")}
  />;
}
