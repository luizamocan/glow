import { useState } from "react";
import { s } from "./LoginPage.styles";
import { loginUser, validateEmail, validatePassword } from "../components/auth";
import { getLastUser } from "../cookies";

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState(getLastUser() || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";

    if (!password.trim()) newErrors.password = "Password is required";
    else {
      const pwErrors = validatePassword(password);
      if (pwErrors.length > 0) newErrors.password = "Password must contain " + pwErrors.join(", ");
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const user = loginUser(email, password);
    if (!user) {
      setErrors({ general: "Invalid email or password" });
      return;
    }

    onLoginSuccess(user);
  };

  const errorText = (field) => errors[field]
    ? <div style={{ fontSize: 13, color: "#e54949", marginTop: -8, marginBottom: 12, marginLeft: 14 }}>{errors[field]}</div>
    : null;

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');`}</style>
      <div style={s.left} />
      <div style={s.right}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 60, cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <span style={{ fontSize: 20, color: "#5f4a28" }}>◀</span>
          <span style={{ fontSize: 20, color: "#5f4a28", fontWeight: 400 }}>Back to website</span>
        </div>

        <h1 style={s.title}>Welcome back!</h1>
        <p style={s.subtitle}>Log in to get started with Glow &amp; Shine</p>
        <p style={s.tagline}>Timeless Beauty, Modern Touch</p>

        {errors.general && (
          <div style={{ background: "#fde8e8", border: "1px solid #e54949", borderRadius: 12, padding: "10px 16px", marginBottom: 16, color: "#e54949", fontSize: 15, fontFamily: "'Libre Bodoni', serif" }}>
            {errors.general}
          </div>
        )}

        <label style={s.label}>Email</label>
        <input
          style={{ ...s.input, ...(errors.email ? { border: "1.5px solid #e54949" } : {}) }}
          type="email"
          placeholder="abc123@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errorText("email")}

        <label style={s.label}>Password</label>
        <input
          style={{ ...s.input, ...(errors.password ? { border: "1.5px solid #e54949" } : {}) }}
          type={showPassword ? "text" : "password"} // Toggles based on checkbox
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorText("password")}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 16 }}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer", width: 16, height: 16, accentColor: "#5f4a28" }}
          />
          <label htmlFor="showPassword" style={{ fontSize: 14, color: "#5f4a28", cursor: "pointer", userSelect: "none" }}>
            Show password
          </label>
        </div>

        <button style={s.loginBtn} onClick={handleLogin}>Log in</button>

        <div style={s.forgotRow}>
          <span style={s.forgot}>Forgot password?</span>
        </div>

        <p style={s.signupRow}>
          Don't you have an account?{" "}
          <span style={s.signupLink} onClick={() => onNavigate("signup")}>Sign up</span>
        </p>

        <div style={{ marginTop: 20, padding: 12, background: "#faf3e8", borderRadius: 12, fontSize: 13, color: "rgba(95,74,40,0.7)" }}>
          <strong>Demo accounts:</strong><br />
          Admin: admin@glowandshine.com / Admin@123<br />
          Client: client@glowandshine.com / Client@123
        </div>
      </div>
    </div>
  );
}