import { useState } from "react";
import { s } from "./SignUpPage.styles";
import { registerUser, validateEmail, validatePassword, USERS } from "../components/auth";

export default function SignUpPage({ onNavigate, onLoginSuccess }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSignup = async () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?[0-9]{7,15}$/.test(form.phone.trim())) newErrors.phone = "Please enter a valid phone number";
    
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Please enter a valid email address";
    else if (USERS.find(u => u.email.toLowerCase() === form.email.toLowerCase()))
      newErrors.email = "An account with this email already exists";
      
    if (!form.password.trim()) newErrors.password = "Password is required";
    else {
      const pwErrors = validatePassword(form.password);
      if (pwErrors.length > 0) newErrors.password = "Password must contain " + pwErrors.join(", ");
    }
    
    if (!form.confirm.trim()) newErrors.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) newErrors.confirm = "Passwords do not match";
    
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    
    try {
      const newUser = await registerUser(form.name.trim(), form.email.trim(), form.password, form.phone.trim());
      onLoginSuccess(newUser);
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const inputStyle = (field) => ({ ...s.input, ...(errors[field] ? { border: "1.5px solid #e54949" } : {}) });
  
  const errorText = (field) => errors[field]
    ? <div style={{ fontSize: 13, color: "#e54949", marginTop: -8, marginBottom: 12, marginLeft: 14 }}>{errors[field]}</div>
    : null;

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');`}</style>
      <div style={s.left} className="auth-left" />
      <div style={s.right} className="auth-right">
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32, cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <span style={{ fontSize: 20, color: "#5f4a28" }}>◀</span>
          <span style={{ fontSize: 20, color: "#5f4a28", fontWeight: 400 }}>Back to website</span>
        </div>
        <h1 style={s.title}>Create your account</h1>
        <p style={s.subtitle}>Join Glow &amp; Shine today</p>
        <p style={s.tagline}>Timeless Beauty, Modern Touch</p>

        {errors.general && (
          <div style={{ background: "#fde8e8", border: "1px solid #e54949", borderRadius: 12, padding: "10px 16px", marginBottom: 16, color: "#e54949", fontSize: 15, fontFamily: "'Libre Bodoni', serif" }}>
            {errors.general}
          </div>
        )}

        <label style={s.label}>Full Name</label>
        <input style={inputStyle("name")} placeholder="Lara Walker" value={form.name} onChange={set("name")} />
        {errorText("name")}

        <label style={s.label}>Phone</label>
        <input style={inputStyle("phone")} placeholder="+40734782335" value={form.phone} onChange={set("phone")} />
        {errorText("phone")}

        <label style={s.label}>Email</label>
        <input style={inputStyle("email")} type="email" placeholder="abc123@gmail.com" value={form.email} onChange={set("email")} />
        {errorText("email")}

        <label style={s.label}>Password</label>
        <input
          style={inputStyle("password")}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
        />
        {errorText("password")}

        <label style={s.label}>Confirm Password</label>
        <input
          style={inputStyle("confirm")}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={form.confirm}
          onChange={set("confirm")}
        />
        {errorText("confirm")}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 16 }}>
          <input
            type="checkbox"
            id="showPasswords"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer", width: 16, height: 16, accentColor: "#5f4a28" }}
          />
          <label htmlFor="showPasswords" style={{ fontSize: 14, color: "#5f4a28", cursor: "pointer", userSelect: "none" }}>
            Show passwords
          </label>
        </div>

        <button style={{ ...s.createBtn, marginTop: 8 }} onClick={handleSignup}>Create Account</button>

        <p style={s.loginRow}>
          Already have an account?{" "}
          <span style={s.loginLink} onClick={() => onNavigate("login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}
