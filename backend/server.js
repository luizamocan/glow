const app  = require("./src/app");
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Glow & Shine API running on http://localhost:${PORT}`);
});