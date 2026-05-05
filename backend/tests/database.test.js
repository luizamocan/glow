const {
  sequelize,
  Service,
  Client,
  Appointment,
  User,
  syncDatabase,
} = require("../src/models");

beforeEach(async () => {
  await syncDatabase({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("ORM database schema", () => {
  test("migrates the domain entities into relational tables", async () => {
    const tables = await sequelize.getQueryInterface().showAllTables();

    expect(tables).toEqual(expect.arrayContaining(["services", "clients", "appointments", "users"]));
  });

  test("stores services, clients, and appointments as separate normalized entities", async () => {
    const serviceColumns = await sequelize.getQueryInterface().describeTable("services");
    const clientColumns = await sequelize.getQueryInterface().describeTable("clients");
    const userColumns = await sequelize.getQueryInterface().describeTable("users");
    const appointmentColumns = await sequelize.getQueryInterface().describeTable("appointments");

    expect(serviceColumns).toHaveProperty("id");
    expect(serviceColumns).toHaveProperty("name");
    expect(serviceColumns).toHaveProperty("price");
    expect(serviceColumns).toHaveProperty("duration");

    expect(clientColumns).toHaveProperty("id");
    expect(clientColumns).toHaveProperty("name");
    expect(clientColumns).toHaveProperty("email");

    expect(userColumns).toHaveProperty("id");
    expect(userColumns).toHaveProperty("email");
    expect(userColumns).toHaveProperty("password");
    expect(userColumns).toHaveProperty("role");
    expect(userColumns).toHaveProperty("client_id");

    expect(appointmentColumns).toHaveProperty("id");
    expect(appointmentColumns).toHaveProperty("service_id");
    expect(appointmentColumns).toHaveProperty("client_id");
    expect(appointmentColumns).not.toHaveProperty("service");
    expect(appointmentColumns).not.toHaveProperty("user_email");
  });

  test("enforces relationships from appointments to services and clients", async () => {
    const foreignKeys = await sequelize.query("PRAGMA foreign_key_list(appointments)", {
      type: sequelize.QueryTypes.SELECT,
    });

    expect(foreignKeys).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ table: "services", from: "service_id", to: "id" }),
        expect.objectContaining({ table: "clients", from: "client_id", to: "id" }),
      ])
    );
  });

  test("seeds initial data through the ORM models", async () => {
    expect(await Service.count()).toBe(8);
    expect(await Client.count()).toBe(1);
    expect(await Appointment.count()).toBe(1);
    expect(await User.count()).toBe(2);
  });

  test("enforces unique service names, client emails, and user emails", async () => {
    await expect(
      Service.create({ name: "Facial", price: 60, duration: 45 })
    ).rejects.toThrow();

    await expect(
      Client.create({ name: "Duplicate", email: "client@glowandshine.com" })
    ).rejects.toThrow();

    await expect(
      User.create({
        name: "Duplicate Admin",
        email: "admin@glowandshine.com",
        password: "Admin@123",
        role: "admin",
      })
    ).rejects.toThrow();
  });

  test("seeds admin and client accounts in the database", async () => {
    const admin = await User.findOne({ where: { email: "admin@glowandshine.com" } });
    const client = await User.findOne({ where: { email: "client@glowandshine.com" } });

    expect(admin.role).toBe("admin");
    expect(admin.clientId).toBeNull();
    expect(client.role).toBe("client");
    expect(client.clientId).toBe(1);
  });
});
