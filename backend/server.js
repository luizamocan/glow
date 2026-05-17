
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { faker } = require("@faker-js/faker");
const store = require("./src/data/store");
const chatStore = require("./src/data/chatStore");
const securityService = require("./src/services/securityService");
const app = require("./src/app"); 
const { syncDatabase } = require("./src/models");
const { connectMongo, mongoUri } = require("./src/nosql/mongo");
const { authenticateToken, requirePermission } = require("./src/middleware/authMiddleware");
const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";
const CERT_DIR = path.join(__dirname, "certs");
const HTTPS_KEY_PATH = process.env.HTTPS_KEY_PATH || path.join(CERT_DIR, "localhost-key.pem");
const HTTPS_CERT_PATH = process.env.HTTPS_CERT_PATH || path.join(CERT_DIR, "localhost-cert.pem");
const HTTPS_PFX_PATH = process.env.HTTPS_PFX_PATH || path.join(CERT_DIR, "localhost.pfx");


const hasPemCert = fs.existsSync(HTTPS_KEY_PATH) && fs.existsSync(HTTPS_CERT_PATH);
const hasPfxCert = fs.existsSync(HTTPS_PFX_PATH);
const httpsOptions = hasPemCert
    ? { key: fs.readFileSync(HTTPS_KEY_PATH), cert: fs.readFileSync(HTTPS_CERT_PATH) }
    : hasPfxCert
        ? { pfx: fs.readFileSync(HTTPS_PFX_PATH), passphrase: process.env.HTTPS_PFX_PASSPHRASE || "" }
        : null;
const server = httpsOptions ? https.createServer(httpsOptions, app) : http.createServer(app);
const protocol = httpsOptions ? "https" : "http";
const wsProtocol = httpsOptions ? "wss" : "ws";
const wss = new WebSocket.Server({ server });

let generationInterval = null;

const broadcast = (payload) => {
    const message = JSON.stringify(payload);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

wss.on("connection", (socket) => {
    socket.on("message", async (rawMessage) => {
        let event;
        try {
            event = JSON.parse(rawMessage.toString());
        } catch (_) {
            return;
        }

        if (event.type !== "CHAT_SEND") return;

        const savedMessage = await chatStore.create(event.payload || {});
        if (savedMessage) {
            await securityService.recordAction({
                userId: savedMessage.userId,
                userEmail: savedMessage.userEmail,
                groupId: savedMessage.role,
                actionType: "chat.message.send",
                actionInformation: {
                    messageId: savedMessage.id,
                    length: savedMessage.text.length
                },
                method: "WEBSOCKET",
                endpoint: `${wsProtocol}://chat`,
            });
            broadcast({ type: "CHAT_MESSAGE", payload: savedMessage });
        }
    });
});

const generateRandomServices = async () => {
    const newService = await store.create({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price({ min: 10, max: 200 })),
        duration: faker.helpers.arrayElement([30, 45, 60, 90]),
        description: faker.commerce.productDescription().substring(0, 100)
    });

    broadcast({ type: "DATA_UPDATED", payload: newService });

    console.log(`[LIVE] Generated: ${newService.name}`);
};


app.post('/api/admin/start-gen', authenticateToken, requirePermission("statistics:read"), (req, res) => {
    if (generationInterval) return res.status(400).json({ error: "Running" });
    
    generationInterval = setInterval(generateRandomServices, 5000);
    console.log(">>> Generator Started");
    res.json({ message: "Started" });
});

app.post('/api/admin/stop-gen', authenticateToken, requirePermission("statistics:read"), (req, res) => {
    clearInterval(generationInterval);
    generationInterval = null;
    console.log(">>> Generator Stopped");
    res.json({ message: "Stopped" });
});

syncDatabase().then(async () => {
    try {
        await connectMongo();
        console.log(`NoSQL: connected to ${mongoUri}`);
    } catch (error) {
        console.warn(`NoSQL: MongoDB not connected (${error.message})`);
    }

    server.listen(PORT, HOST, () => {
        console.log(`
     Glow & Shine Server Ready
    ----------------------------
    API: ${protocol}://${HOST}:${PORT}
    WS:  ${wsProtocol}://${HOST}:${PORT}
    HTTPS: ${httpsOptions ? "enabled" : "missing certs, using HTTP fallback"}
    `);
    });
}).catch(error => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
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
