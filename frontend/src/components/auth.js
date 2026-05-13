import PROFILE_PIC_CLIENT from "../assets/profile_pic.png";
import PROFILE_PIC_ADMIN from "../assets/client.jpg";
import NEW_CLIENT from "../assets/client-avatar.jpg";
import { API_BASE_URL } from "../config";
export const USERS = [];

const withAvatar = (user) => ({
  ...user,
  avatar: user.role === "admin" ? PROFILE_PIC_ADMIN : PROFILE_PIC_CLIENT,
});

export const loginUser = async (email, password, secondFactor = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, ...secondFactor }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  if (response.status === 202) return data;
  return withAvatar({
    ...data.user,
    token: data.token,
    expiresAt: data.expiresAt,
    inactivityTimeoutMs: data.inactivityTimeoutMs,
    permissionScheme: data.permissionScheme,
    authLevel: data.authLevel,
  });
};

export const registerUser = async (name, email, password, phone = "") => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return {
    ...data.user,
    token: data.token,
    expiresAt: data.expiresAt,
    inactivityTimeoutMs: data.inactivityTimeoutMs,
    permissionScheme: data.permissionScheme,
    authLevel: data.authLevel,
    avatar: NEW_CLIENT,
  };
};

export const requestPasswordRecovery = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/password-recovery/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) return null;
  return response.json();
};

export const resetPassword = async (email, resetToken, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/password-recovery/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, resetToken, newPassword }),
  });

  return response.ok;
};

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("one number");
  if (!/[^a-zA-Z0-9]/.test(password)) errors.push("one special character");
  return errors;
};
