const request = require("supertest");
const app     = require("../src/app");
const store   = require("../src/data/store");
const { Service, sequelize } = require("../src/models");

beforeEach(async () => {
  await store.reset();
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /api/services", () => {
  test("returns paginated services", async () => {
    const res = await request(app).get("/api/services");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(4);
    expect(res.body.pagination.total).toBe(8);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  test("page 2 returns correct services", async () => {
    const res = await request(app).get("/api/services?page=2");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(4);
    expect(res.body.pagination.page).toBe(2);
  });

  test("search filters correctly", async () => {
    const res = await request(app).get("/api/services?search=facial");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Facial");
  });

  test("custom limit works", async () => {
    const res = await request(app).get("/api/services?limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.totalPages).toBe(4);
  });
});

describe("GET /api/services/:id", () => {
  test("returns service by id", async () => {
    const res = await request(app).get("/api/services/1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Facial");
  });

  test("returns 404 for non-existent id", async () => {
    const res = await request(app).get("/api/services/999");
    expect(res.status).toBe(404);
  });

  test("returns 400 for invalid id", async () => {
    const res = await request(app).get("/api/services/abc");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/services", () => {
  test("creates a new service", async () => {
    const res = await request(app).post("/api/services").send({
      name: "Waxing", price: 30, duration: 20, description: "Full waxing"
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Waxing");
    expect(res.body.id).toBeDefined();
  });

  test("rejects missing name", async () => {
    const res = await request(app).post("/api/services").send({ price: 30, duration: 20 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test("rejects negative price", async () => {
    const res = await request(app).post("/api/services").send({ name: "Waxing", price: -10, duration: 20 });
    expect(res.status).toBe(400);
  });

  test("rejects zero price", async () => {
    const res = await request(app).post("/api/services").send({ name: "Waxing", price: 0, duration: 20 });
    expect(res.status).toBe(400);
  });

  test("rejects decimal price", async () => {
    const res = await request(app).post("/api/services").send({ name: "Waxing", price: 9.99, duration: 20 });
    expect(res.status).toBe(400);
  });

  test("rejects duration over 480", async () => {
    const res = await request(app).post("/api/services").send({ name: "Waxing", price: 30, duration: 500 });
    expect(res.status).toBe(400);
  });

  test("rejects duplicate name", async () => {
    const res = await request(app).post("/api/services").send({ name: "Facial", price: 30, duration: 20 });
    expect(res.status).toBe(409);
  });

  test("rejects name with numbers", async () => {
    const res = await request(app).post("/api/services").send({ name: "Facial123", price: 30, duration: 20 });
    expect(res.status).toBe(400);
  });

  test("rejects description over 200 chars", async () => {
    const res = await request(app).post("/api/services").send({
      name: "Waxing", price: 30, duration: 20, description: "A".repeat(201)
    });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/services/:id", () => {
  test("updates a service", async () => {
    const res = await request(app).put("/api/services/1").send({ price: 60 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(60);
  });

  test("returns 404 for non-existent id", async () => {
    const res = await request(app).put("/api/services/999").send({ price: 60 });
    expect(res.status).toBe(404);
  });

  test("rejects invalid price on update", async () => {
    const res = await request(app).put("/api/services/1").send({ price: -5 });
    expect(res.status).toBe(400);
  });

  test("rejects duplicate name on update", async () => {
    const res = await request(app).put("/api/services/1").send({ name: "Haircut" });
    expect(res.status).toBe(409);
  });

  test("allows same name on same service", async () => {
    const res = await request(app).put("/api/services/1").send({ name: "Facial", price: 60 });
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/services/:id", () => {
  test("deletes a service", async () => {
    const res = await request(app).delete("/api/services/1");
    expect(res.status).toBe(204);
    const check = await request(app).get("/api/services/1");
    expect(check.status).toBe(404);
  });

  test("returns 404 for non-existent id", async () => {
    const res = await request(app).delete("/api/services/999");
    expect(res.status).toBe(404);
  });

  test("returns 400 for invalid id", async () => {
    const res = await request(app).delete("/api/services/abc");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/services/statistics", () => {
  test("returns statistics", async () => {
    const res = await request(app).get("/api/services/statistics");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(8);
    expect(res.body.avgPrice).toBeDefined();
    expect(res.body.priceTiers).toBeDefined();
    expect(res.body.durationBuckets).toBeDefined();
  });

  test("price tiers add up to total", async () => {
    const res = await request(app).get("/api/services/statistics");
    const { low, medium, high } = res.body.priceTiers;
    expect(low + medium + high).toBe(res.body.total);
  });

  test("duration buckets add up to total", async () => {
    const res = await request(app).get("/api/services/statistics");
    const buckets = Object.values(res.body.durationBuckets);
    expect(buckets.reduce((a, b) => a + b, 0)).toBe(res.body.total);
  });
});

describe("Global Error Handlers & Edge Cases", () => {
  test("returns 404 for non-existent routes", async () => {
    const res = await request(app).get("/api/wrong-route");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Route not found");
  });

  test("rejects name longer than 50 characters", async () => {
    const res = await request(app).post("/api/services").send({
      name: "A".repeat(51),
      price: 50,
      duration: 30
    });
    expect(res.status).toBe(400);
  });

  test("rejects name shorter than 3 characters", async () => {
    const res = await request(app).post("/api/services").send({
      name: "Ab",
      price: 50,
      duration: 30
    });
    expect(res.status).toBe(400);
  });

  test("statistics returns 0 total if store is empty", async () => {
    await Service.destroy({ where: {} });
    const res = await request(app).get("/api/services/statistics");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
  });
});

describe("Appointment persistence and relational queries", () => {
  test("creates an appointment linked to an existing service", async () => {
    const res = await request(app).post("/api/appointments").send({
      service: "Facial",
      serviceId: 1,
      date: "2026-05-10",
      time: "10:00 AM",
      price: 50,
      userEmail: "client@example.com",
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.serviceId).toBe(1);
    expect(res.body.service).toBe("Facial");
    expect(res.body.userEmail).toBe("client@example.com");
    expect(res.body.status).toBe("Upcoming");
  });

  test("filters appointments by email", async () => {
    await request(app).post("/api/appointments").send({
      service: "Facial",
      serviceId: 1,
      date: "2026-05-10",
      time: "10:00 AM",
      price: 50,
      userEmail: "client@example.com",
    });

    const res = await request(app).get("/api/appointments?email=client@example.com");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].userEmail).toBe("client@example.com");
  });

  test("counts and updates appointments for a service", async () => {
    const created = await request(app).post("/api/appointments").send({
      service: "Facial",
      serviceId: 1,
      date: "2026-05-10",
      time: "10:00 AM",
      price: 50,
      userEmail: "client@example.com",
    });

    const count = await request(app).get("/api/services/1/appointment-count");
    expect(count.status).toBe(200);
    expect(count.body.count).toBe(1);

    const updated = await request(app)
      .put(`/api/services/1/appointments/${created.body.id}/status`)
      .send({ status: "Completed" });

    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("Completed");
  });

  test("deletes an appointment", async () => {
    const created = await request(app).post("/api/appointments").send({
      service: "Facial",
      serviceId: 1,
      date: "2026-05-10",
      time: "10:00 AM",
      price: 50,
      userEmail: "client@example.com",
    });

    const deleted = await request(app).delete(`/api/appointments/${created.body.id}`);
    expect(deleted.status).toBe(204);

    const res = await request(app).get("/api/appointments?email=client@example.com");
    expect(res.body).toHaveLength(0);
  });
});

describe("Client persistence", () => {
  test("returns paginated clients", async () => {
    const res = await request(app).get("/api/clients");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.total).toBe(1);
  });

  test("creates a client", async () => {
    const res = await request(app).post("/api/clients").send({
      name: "Ana Pop",
      email: "ana@example.com",
      phone: "0711111111",
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe("ana@example.com");
  });

  test("filters clients by search", async () => {
    await request(app).post("/api/clients").send({
      name: "Ana Pop",
      email: "ana@example.com",
    });

    const res = await request(app).get("/api/clients?search=ana");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Ana Pop");
  });

  test("updates a client", async () => {
    const created = await request(app).post("/api/clients").send({
      name: "Ana Pop",
      email: "ana@example.com",
    });

    const res = await request(app)
      .put(`/api/clients/${created.body.id}`)
      .send({ phone: "0722222222" });

    expect(res.status).toBe(200);
    expect(res.body.phone).toBe("0722222222");
  });

  test("deletes a client", async () => {
    const created = await request(app).post("/api/clients").send({
      name: "Ana Pop",
      email: "ana@example.com",
    });

    const deleted = await request(app).delete(`/api/clients/${created.body.id}`);
    expect(deleted.status).toBe(204);

    const check = await request(app).get(`/api/clients/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  test("rejects duplicate client email", async () => {
    const res = await request(app).post("/api/clients").send({
      name: "Another Client",
      email: "client@glowandshine.com",
    });

    expect(res.status).toBe(409);
  });
});

describe("DB-backed authentication", () => {
  test("logs in with the seeded admin account", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@glowandshine.com",
      password: "Admin@123",
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("admin@glowandshine.com");
    expect(res.body.role).toBe("admin");
    expect(res.body.password).toBeUndefined();
  });

  test("registers a new client account in users and clients", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Mara Ionescu",
      email: "mara@example.com",
      password: "Client@123",
      phone: "0733333333",
    });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe("client");
    expect(res.body.clientId).toBeDefined();

    const login = await request(app).post("/api/auth/login").send({
      email: "mara@example.com",
      password: "Client@123",
    });

    expect(login.status).toBe(200);
    expect(login.body.email).toBe("mara@example.com");
  });
});

describe("NoSQL activity endpoint", () => {
  test("reports MongoDB activity status without breaking the relational API", async () => {
    const res = await request(app).get("/api/activity");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("connected");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
