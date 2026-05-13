import { useState } from "react";
import { s } from "./LoginPage.styles";
import { loginUser, requestPasswordRecovery, resetPassword, validateEmail, validatePassword } from "../components/auth";
import { getLastUser } from "../cookies";

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState(getLastUser() || "");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [oneTimeCode, setOneTimeCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";

    if (!password.trim()) newErrors.password = "Password is required";
    else {
      const pwErrors = validatePassword(password);
      if (pwErrors.length > 0) newErrors.password = "Password must contain " + pwErrors.join(", ");
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    let user = null;
    try {
      user = await loginUser(email, password, challenge ? {
        challengeId: challenge.challengeId,
        oneTimeCode,
        recoveryCode,
      } : {});
    } catch (_) {
      setErrors({ general: "Secure server is unreachable. Check HTTPS/LAN connection." });
      return;
    }

    if (user?.requiresSecondFactor) {
      setChallenge(user);
      setErrors({ general: `Enter the one-time code ${user.oneTimeCode} or recovery code ${user.recoveryCode}` });
      return;
    }

    if (!user?.token) {
      setErrors({ general: "Invalid email or password" });
      return;
    }

    onLoginSuccess(user);
  };

  const handleRecoveryRequest = async () => {
    if (!email.trim() || !validateEmail(email)) {
      setErrors({ email: "Enter your account email first" });
      return;
    }

    const recovery = await requestPasswordRecovery(email.trim());
    if (!recovery) {
      setErrors({ general: "Could not start password recovery" });
      return;
    }
    setResetToken(recovery.resetToken || "");
    setErrors({ general: `Recovery token generated: ${recovery.resetToken || "check server logs"}` });
  };

  const handlePasswordReset = async () => {
    const pwErrors = validatePassword(newPassword);
    if (!resetToken || pwErrors.length > 0) {
      setErrors({ general: "Enter a recovery token and a strong new password" });
      return;
    }

    const ok = await resetPassword(email.trim(), resetToken.trim(), newPassword);
    setErrors({ general: ok ? "Password reset. Log in with the new password." : "Invalid or expired recovery token." });
    if (ok) {
      setPassword(newPassword);
      setNewPassword("");
      setResetToken("");
    }
  };

  const errorText = (field) => errors[field]
    ? <div style={{ fontSize: 13, color: "#e54949", marginTop: -8, marginBottom: 12, marginLeft: 14 }}>{errors[field]}</div>
    : null;

  return (
    <div style={s.page} className="auth-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');
        @media (max-width: 768px) {
          .auth-page {
            display: block !important;
            width: 100% !important;
            min-height: 100vh !important;
            height: auto !important;
            overflow: auto !important;
          }
          .auth-left { display: none !important; }
          .auth-right {
            min-height: 100vh !important;
            width: 100% !important;
            padding: 28px 22px 36px !important;
            justify-content: flex-start !important;
            overflow: visible !important;
          }
          .auth-back { margin-bottom: 34px !important; }
          .auth-title { font-size: 40px !important; line-height: 1.08 !important; }
          .auth-subtitle,
          .auth-tagline { font-size: 18px !important; }
          .auth-tagline { margin-bottom: 28px !important; }
          .auth-label { font-size: 17px !important; }
          .auth-input,
          .auth-login-btn {
            height: 48px !important;
            border-radius: 16px !important;
            font-size: 16px !important;
          }
          .auth-forgot-row { margin-bottom: 26px !important; }
          .auth-forgot,
          .auth-signup-row { font-size: 17px !important; }
        }
      `}</style>
      <div style={s.left} className="auth-left" />
      <div style={s.right} className="auth-right">
        <div className="auth-back" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 60, cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <span style={{ fontSize: 20, color: "#5f4a28" }}>◀</span>
          <span style={{ fontSize: 20, color: "#5f4a28", fontWeight: 400 }}>Back to website</span>
        </div>

        <h1 style={s.title} className="auth-title">Welcome back!</h1>
        <p style={s.subtitle} className="auth-subtitle">Log in to get started with Glow &amp; Shine</p>
        <p style={s.tagline} className="auth-tagline">Timeless Beauty, Modern Touch</p>

        {errors.general && (
          <div style={{ background: "#fde8e8", border: "1px solid #e54949", borderRadius: 12, padding: "10px 16px", marginBottom: 16, color: "#e54949", fontSize: 15, fontFamily: "'Libre Bodoni', serif" }}>
            {errors.general}
          </div>
        )}

        <label style={s.label} className="auth-label">Email</label>
        <input
          className="auth-input"
          style={{ ...s.input, ...(errors.email ? { border: "1.5px solid #e54949" } : {}) }}
          type="email"
          placeholder="abc123@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errorText("email")}

        <label style={s.label} className="auth-label">Password</label>
        <input
          className="auth-input"
          style={{ ...s.input, ...(errors.password ? { border: "1.5px solid #e54949" } : {}) }}
          type={showPassword ? "text" : "password"} // Toggles based on checkbox
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorText("password")}

        {challenge && (
          <>
            <label style={s.label} className="auth-label">One-time code</label>
            <input
              className="auth-input"
              style={s.input}
              placeholder="123456"
              value={oneTimeCode}
              onChange={(e) => setOneTimeCode(e.target.value)}
            />

            <label style={s.label} className="auth-label">Recovery code</label>
            <input
              className="auth-input"
              style={s.input}
              placeholder="USER-2-RECOVERY"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
            />
          </>
        )}

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

        <button style={s.loginBtn} className="auth-login-btn" onClick={handleLogin}>Log in</button>

        <div style={s.forgotRow} className="auth-forgot-row">
          <span style={s.forgot} className="auth-forgot" onClick={handleRecoveryRequest}>Forgot password?</span>
        </div>

        {resetToken && (
          <div style={{ marginTop: -10, marginBottom: 16 }}>
            <label style={s.label} className="auth-label">New password</label>
            <input
              className="auth-input"
              style={s.input}
              type="password"
              placeholder="New strong password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button style={{ ...s.loginBtn, height: 46 }} className="auth-login-btn" onClick={handlePasswordReset}>Reset password</button>
          </div>
        )}

        <p style={s.signupRow} className="auth-signup-row">
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
