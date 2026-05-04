
const http = require("http");
const WebSocket = require("ws");
const { faker } = require("@faker-js/faker");
const store = require("./src/data/store");
const app = require("./src/app"); 
const PORT = 5000;


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let generationInterval = null;


const generateRandomServices = () => {
    const newService = store.create({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price({ min: 10, max: 200 })),
        duration: faker.helpers.arrayElement([30, 45, 60, 90]),
        description: faker.commerce.productDescription().substring(0, 100)
    });

    const message = JSON.stringify({ 
        type: "DATA_UPDATED", 
        payload: newService 
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    console.log(`[LIVE] Generated: ${newService.name}`);
};


app.post('/api/admin/start-gen', (req, res) => {
    if (generationInterval) return res.status(400).json({ error: "Running" });
    
    generationInterval = setInterval(generateRandomServices, 5000);
    console.log(">>> Generator Started");
    res.json({ message: "Started" });
});

app.post('/api/admin/stop-gen', (req, res) => {
    clearInterval(generationInterval);
    generationInterval = null;
    console.log(">>> Generator Stopped");
    res.json({ message: "Stopped" });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

server.listen(PORT, () => {
    console.log(`
     Glow & Shine Server Ready
    ----------------------------
    API: http://localhost:${PORT}
    WS:  ws://localhost:${PORT}
    `);
});

/*
const http = require("http");
const WebSocket = require("ws");
const { faker } = require("@faker-js/faker");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");
const serviceStore = require("./src/data/store");

const PORT = 5000;

async function start() {
  // ── Apollo Standalone Server ───────────────────────────────────
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: PORT },
    context: async ({ req }) => ({ req }),
  });

  console.log(`
   Glow & Shine Server Ready
  ----------------------------
  GraphQL: ${url}
  `);

  // ── WebSocket on a SEPARATE port (5001) ────────────────────────
  // startStandaloneServer owns port 5000, so WS gets its own port
  const wsServer = new WebSocket.Server({ port: 5001 });

  const broadcast = (payload) => {
    const message = JSON.stringify(payload);
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(message);
    });
  };

  let generationInterval = null;

  const generateRandomService = () => {
    const newService = serviceStore.create({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price({ min: 10, max: 200 })),
      duration: faker.helpers.arrayElement([30, 45, 60, 90]),
      description: faker.commerce.productDescription().substring(0, 100),
      image: `https://picsum.photos/seed/${Date.now()}/400/300`,
    });
    broadcast({ type: "DATA_UPDATED", payload: newService });
    console.log(`[LIVE] Generated: ${newService.name}`);
  };

  console.log("  WS:      ws://localhost:5001");

  // ── Faker REST controls on port 5002 ───────────────────────────
  const express = require("express");
  const cors = require("cors");
  const adminApp = express();
  adminApp.use(cors());
  adminApp.use(express.json());

  adminApp.post("/api/admin/start-gen", (req, res) => {
    if (generationInterval)
      return res.status(400).json({ error: "Already running" });
    generationInterval = setInterval(generateRandomService, 3000);
    console.log(">>> Generator Started");
    res.json({ message: "Started" });
  });

  adminApp.post("/api/admin/stop-gen", (req, res) => {
    clearInterval(generationInterval);
    generationInterval = null;
    console.log(">>> Generator Stopped");
    res.json({ message: "Stopped" });
  });

  adminApp.listen(5002, () =>
    console.log("  Admin:   http://localhost:5002")
  );
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
*/