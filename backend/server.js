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