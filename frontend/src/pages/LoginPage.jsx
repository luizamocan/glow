import { useEffect, useRef, useState } from "react";
import { s } from "./LoginPage.styles";
import {
  googleLoginUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  validateEmail,
  validatePassword,
} from "../components/auth";
import { getLastUser } from "../cookies";

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState(getLastUser() || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState("login");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (mode !== "login") return undefined;
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return undefined;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const user = await googleLoginUser(response.credential);
            onLoginSuccess(user);
          } catch (error) {
            setErrors({ general: error.message });
          }
        },
      });
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => setErrors({ general: "Google login script could not be loaded" });
    document.body.appendChild(script);
    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [mode, onLoginSuccess]);

  const handleLogin = async () => {
    const newErrors = {};
    if (!identifier.trim()) newErrors.email = "Email or username is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const user = await loginUser(identifier, password);
    if (!user) {
      setErrors({ general: "Invalid email/username or password" });
      return;
    }

    onLoginSuccess(user);
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(identifier)) {
      setErrors({ email: "Enter your account email first" });
      return;
    }
    try {
      const result = await requestPasswordReset(identifier);
      setResetToken(result.resetToken || "");
      setMode("reset");
      setErrors({
        general: result.resetToken
          ? `Demo reset code: ${result.resetToken}`
          : "If the email exists, a reset code was generated.",
      });
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleResetPassword = async () => {
    const pwErrors = validatePassword(newPassword);
    if (!resetToken.trim() || pwErrors.length > 0) {
      setErrors({
        general: !resetToken.trim()
          ? "Reset code is required"
          : "Password must contain " + pwErrors.join(", "),
      });
      return;
    }
    try {
      await resetPassword(resetToken.trim(), newPassword);
      setMode("login");
      setPassword("");
      setNewPassword("");
      setErrors({ general: "Password reset successfully. You can log in now." });
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const errorText = (field) =>
    errors[field] ? (
      <div style={{ fontSize: 13, color: "#e54949", marginTop: -8, marginBottom: 12, marginLeft: 14 }}>
        {errors[field]}
      </div>
    ) : null;

  return (
    <div style={s.page} className="auth-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;700&display=swap');
        @media (max-width: 768px) {
          .auth-page { display: block !important; width: 100% !important; min-height: 100vh !important; height: auto !important; overflow: auto !important; }
          .auth-left { display: none !important; }
          .auth-right { min-height: 100vh !important; width: 100% !important; padding: 28px 22px 36px !important; justify-content: flex-start !important; overflow: visible !important; }
          .auth-back { margin-bottom: 34px !important; }
          .auth-title { font-size: 40px !important; line-height: 1.08 !important; }
          .auth-subtitle, .auth-tagline { font-size: 18px !important; }
          .auth-tagline { margin-bottom: 28px !important; }
          .auth-label { font-size: 17px !important; }
          .auth-input, .auth-login-btn { height: 48px !important; border-radius: 16px !important; font-size: 16px !important; }
          .auth-forgot-row { margin-bottom: 26px !important; }
          .auth-forgot, .auth-signup-row { font-size: 17px !important; }
        }
      `}</style>
      <div style={s.left} className="auth-left" />
      <div style={s.right} className="auth-right">
        <div className="auth-back" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 60, cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <span style={{ fontSize: 20, color: "#5f4a28" }}>{"<"}</span>
          <span style={{ fontSize: 20, color: "#5f4a28", fontWeight: 400 }}>Back to website</span>
        </div>

        <h1 style={s.title} className="auth-title">Welcome back!</h1>
        <p style={s.subtitle} className="auth-subtitle">{mode === "login" ? "Log in to get started with Glow & Shine" : "Reset your password"}</p>
        <p style={s.tagline} className="auth-tagline">Timeless Beauty, Modern Touch</p>

        {errors.general && (
          <div style={{ background: "#fde8e8", border: "1px solid #e54949", borderRadius: 12, padding: "10px 16px", marginBottom: 16, color: "#e54949", fontSize: 15, fontFamily: "'Libre Bodoni', serif" }}>
            {errors.general}
          </div>
        )}

        <label style={s.label} className="auth-label">Email or Username</label>
        <input
          className="auth-input"
          style={{ ...s.input, ...(errors.email ? { border: "1.5px solid #e54949" } : {}) }}
          placeholder="client@glowandshine.com or client"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        {errorText("email")}

        {mode === "login" ? (
          <>
            <label style={s.label} className="auth-label">Password</label>
            <input
              className="auth-input"
              style={{ ...s.input, ...(errors.password ? { border: "1.5px solid #e54949" } : {}) }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorText("password")}
          </>
        ) : (
          <>
            <label style={s.label} className="auth-label">Reset Code</label>
            <input className="auth-input" style={s.input} placeholder="Paste reset code" value={resetToken} onChange={(e) => setResetToken(e.target.value)} />
            <label style={s.label} className="auth-label">New Password</label>
            <input className="auth-input" style={s.input} type={showPassword ? "text" : "password"} placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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

        <button style={s.loginBtn} className="auth-login-btn" onClick={mode === "login" ? handleLogin : handleResetPassword}>
          {mode === "login" ? "Log in" : "Reset Password"}
        </button>

        {mode === "login" && (
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            {process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
              <div ref={googleButtonRef} />
            ) : (
              <button
                style={{ ...s.loginBtn, background: "#fff", color: "#5f4a28", border: "1.5px solid #5f4a28" }}
                className="auth-login-btn"
                onClick={() => setErrors({ general: "Set REACT_APP_GOOGLE_CLIENT_ID to enable real Google login" })}
              >
                Continue with Google
              </button>
            )}
          </div>
        )}

        <div style={s.forgotRow} className="auth-forgot-row">
          <span style={s.forgot} className="auth-forgot" onClick={mode === "login" ? handleForgotPassword : () => setMode("login")}>
            {mode === "login" ? "Forgot password?" : "Back to login"}
          </span>
        </div>

        <p style={s.signupRow} className="auth-signup-row">
          Don't you have an account?{" "}
          <span style={s.signupLink} onClick={() => onNavigate("signup")}>Sign up</span>
        </p>

        <div style={{ marginTop: 20, padding: 12, background: "#faf3e8", borderRadius: 12, fontSize: 13, color: "rgba(95,74,40,0.7)" }}>
          <strong>Demo accounts:</strong><br />
          Admin: admin@glowandshine.com or admin / Admin@123<br />
          Client: client@glowandshine.com or client / Client@123
        </div>
      </div>
    </div>
  );
}
