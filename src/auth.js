
const DEFAULT_USERS = [
  {
    id: 1,
    email: "admin@glowandshine.com",
    password: "Admin@123",
    name: "Luiza Mocan",
    role: "admin",
    avatar: "https://www.figma.com/api/mcp/asset/0571e238-4422-42dd-b48c-05bf29ff44f4",
  },
  {
    id: 2,
    email: "client@glowandshine.com",
    password: "Client@123",
    name: "Luiza Mocan",
    role: "client",
    avatar: "https://www.figma.com/api/mcp/asset/0d6b6178-e08a-447b-85f3-5d359ed372d2",
  },
];

// 1. Check if we already have saved users in localStorage. 
// If we do, parse them. If we don't, use the DEFAULT_USERS.
const savedUsers = localStorage.getItem("glow_users");
export const USERS = savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;

export const loginUser = (email, password) => {
  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
};

export const registerUser = (name, email, password) => {
  // Any new signup becomes a client
  const newUser = {
    id: Date.now(),
    email,
    password,
    name,
    role: "client",
    avatar: "https://www.figma.com/api/mcp/asset/0d6b6178-e08a-447b-85f3-5d359ed372d2",
  };
  
  // Add the new user to our current array
  USERS.push(newUser);
  
  // 2. Save the newly updated array back into localStorage!
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