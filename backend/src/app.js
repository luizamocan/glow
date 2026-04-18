const express        = require("express");
const cors           = require("cors");
const serviceRoutes  = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => res.json({ status: "Glow & Shine API running" }));

module.exports = app;