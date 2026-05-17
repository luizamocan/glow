import PROFILE_PIC_CLIENT from "../assets/profile_pic.png";
import PROFILE_PIC_ADMIN from "../assets/client.jpg";
import NEW_CLIENT from "../assets/client-avatar.jpg";
import { API_BASE_URL } from "../config";
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


const savedUsers = localStorage.getItem("glow_users");
export const USERS = savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;

const withAvatar = (user) => ({
  ...user,
  avatar: user.role === "admin" ? PROFILE_PIC_ADMIN : PROFILE_PIC_CLIENT,
});

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return withAvatar(await response.json());
    }
  } catch (_) {
    // Keep local fallback for offline development.
  }

  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user ? withAvatar(user) : null;
};

export const registerUser = async (name, email, password, phone = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (response.ok) {
      return { ...(await response.json()), avatar: NEW_CLIENT };
    }
  } catch (_) {
    // Keep local fallback for offline development.
  }

  const newUser = {
    id: Date.now(),
    email,
    password,
    name,
    role: "client",
    avatar: NEW_CLIENT,
  };
  

  USERS.push(newUser);
  localStorage.setItem("glow_users", JSON.stringify(USERS));
  
  return newUser;
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
