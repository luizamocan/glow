import PROFILE_PIC_CLIENT from "../assets/profile_pic.png";
import PROFILE_PIC_ADMIN from "../assets/client.jpg";
import NEW_CLIENT from "../assets/client-avatar.jpg";
import { API_BASE_URL } from "../config";
import { saveSession } from "../api";
const DEFAULT_USERS = [
  {
    id: 1,
    email: "admin@glowandshine.com",
    password: "Admin@123",
    name: "Luiza Mocan",
    role: "admin",
    avatar: PROFILE_PIC_ADMIN,
  },
  {
    id: 2,
    email: "client@glowandshine.com",
    password: "Client@123",
    name: "Luiza Mocan",
    role: "client",
    avatar: PROFILE_PIC_CLIENT,
  },
];


export const USERS = DEFAULT_USERS;

const withAvatar = (user) => ({
  ...user,
  avatar: user.role === "admin" ? PROFILE_PIC_ADMIN : PROFILE_PIC_CLIENT,
});

export const loginUser = async (identifier, password) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
  } catch (_) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const session = await response.json();
  const user = withAvatar({ ...session.user, token: session.token });
  saveSession({ ...session, user });
  return user;
};

export const registerUser = async (name, email, password, phone = "", username = "") => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone, username }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Registration failed");
  }

  const session = await response.json();
  const user = { ...session.user, token: session.token, avatar: NEW_CLIENT };
  saveSession({ ...session, user });
  return user;
};

export const googleLoginUser = async (credential) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Google login failed");
  }

  const session = await response.json();
  const user = withAvatar({ ...session.user, token: session.token });
  saveSession({ ...session, user });
  return user;
};

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Could not request password reset");
  return response.json();
};

export const resetPassword = async (token, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Password reset failed");
  }
  return response.json();
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
