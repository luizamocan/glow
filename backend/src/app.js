const express        = require("express");
const cors           = require("cors");
const serviceRoutes  = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.json({ status: "Glow & Shine API running" }));

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
