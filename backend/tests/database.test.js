const {
  sequelize,
  Service,
  Client,
  Appointment,
  User,
  ActionLog,
  ObservationList,
  syncDatabase,
} = require("../src/models");
const securityService = require("../src/services/securityService");

beforeEach(async () => {
  await syncDatabase({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("ORM database schema", () => {
  test("migrates the domain entities into relational tables", async () => {
    const tables = await sequelize.getQueryInterface().showAllTables();

    expect(tables).toEqual(expect.arrayContaining([
      "services",
      "clients",
      "appointments",
      "users",
      "roles",
      "permissions",
      "user_roles",
      "role_permissions",
      "action_logs",
      "observation_list",
    ]));
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

  test("persists backend actions in the security log table", async () => {
    await securityService.recordAction({
      userId: 1,
      userEmail: "admin@glowandshine.com",
      groupId: "admin",
      actionType: "services.delete",
      actionInformation: "Admin deleted service 1",
      method: "DELETE",
      endpoint: "/api/services/1",
      statusCode: 204,
    });

    const log = await ActionLog.findOne({ where: { userId: 1 } });
    expect(log.groupId).toBe("admin");
    expect(log.actionType).toBe("services.delete");
    expect(log.actionInformation).toContain("Admin deleted");
  });

  test("places suspicious users in the observation list after repeated failed logins", async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await securityService.recordAction({
        userEmail: "intruder@example.com",
        groupId: "anonymous",
        actionType: "auth.login",
        actionInformation: `Failed login attempt ${attempt + 1}`,
        method: "POST",
        endpoint: "/api/auth/login",
        statusCode: 401,
      });
    }

    const observation = await ObservationList.findOne({
      where: { observedIdentity: "email:intruder@example.com" },
    });

    expect(observation).not.toBeNull();
    expect(observation.severity).toBe("high");
    expect(observation.reason).toContain("failed login");
  });
});
