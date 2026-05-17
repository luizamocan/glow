const sequelize = require("../db/sequelize");
const Service = require("./Service");
const Client = require("./Client");
const Appointment = require("./Appointment");
const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const ActionLog = require("./ActionLog");
const ObservationList = require("./ObservationList");

Service.hasMany(Appointment, {
  foreignKey: "serviceId",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

Client.hasMany(Appointment, {
  foreignKey: "clientId",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

Client.hasOne(User, {
  foreignKey: "clientId",
  as: "user",
  onDelete: "CASCADE",
});

User.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

User.hasMany(ActionLog, {
  foreignKey: "userId",
  as: "actionLogs",
  onDelete: "SET NULL",
});

ActionLog.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(ObservationList, {
  foreignKey: "userId",
  as: "observations",
  onDelete: "SET NULL",
});

ObservationList.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

Role.belongsToMany(User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
  as: "users",
});

Role.belongsToMany(Permission, {
  through: "role_permissions",
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: "role_permissions",
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

const seedServices = [
  { id: 1, name: "Facial", price: 50, duration: 60, description: "Deep skin cleansing treatment" },
  { id: 2, name: "Haircut", price: 35, duration: 45, description: "Precision haircut & styling" },
  { id: 3, name: "Manicure", price: 30, duration: 90, description: "Full manicure service" },
  { id: 4, name: "Spa Treatment", price: 100, duration: 120, description: "Full body spa relaxation" },
  { id: 5, name: "Pedicure", price: 40, duration: 60, description: "Full pedicure with nail polish" },
  { id: 6, name: "Eyebrow Shaping", price: 25, duration: 30, description: "Professional eyebrow threading" },
  { id: 7, name: "Hair Coloring", price: 80, duration: 90, description: "Full hair coloring" },
  { id: 8, name: "Deep Massage", price: 70, duration: 75, description: "Relaxing deep tissue massage" },
];

const seedAppointments = [
  {
    id: 1,
    serviceId: 3,
    clientId: 1,
    date: "2024-03-10",
    time: "11:15 AM",
    status: "Completed",
    rating: 5,
  },
];

const seedClients = [
  { id: 1, name: "Luiza Mocan", email: "client@glowandshine.com", phone: "0700000000" },
];

const seedUsers = [
  {
    id: 1,
    name: "Luiza Mocan",
    email: "admin@glowandshine.com",
    password: "Admin@123",
    role: "admin",
    clientId: null,
  },
  {
    id: 2,
    name: "Luiza Mocan",
    email: "client@glowandshine.com",
    password: "Client@123",
    role: "client",
    clientId: 1,
  },
];

const seedRoles = [
  { id: 1, name: "admin", description: "Full access to all Glow & Shine features" },
  { id: 2, name: "user", description: "Restricted customer access" },
];

const seedPermissions = [
  { id: 1, code: "services:read", description: "View services" },
  { id: 2, code: "services:create", description: "Create services" },
  { id: 3, code: "services:update", description: "Update services" },
  { id: 4, code: "services:delete", description: "Delete services" },
  { id: 5, code: "appointments:read", description: "View appointments" },
  { id: 6, code: "appointments:create", description: "Book appointments" },
  { id: 7, code: "appointments:update", description: "Update appointment status" },
  { id: 8, code: "appointments:delete", description: "Cancel appointments" },
  { id: 9, code: "clients:read", description: "View clients" },
  { id: 10, code: "clients:manage", description: "Create, update, and delete clients" },
  { id: 11, code: "statistics:read", description: "View statistics" },
  { id: 12, code: "chat:use", description: "Use real-time chat" },
];

const seedRolePermissions = {
  admin: seedPermissions.map((permission) => permission.code),
  user: ["services:read", "appointments:read", "appointments:create", "appointments:delete", "chat:use"],
};

const seedDatabase = async () => {
  const serviceCount = await Service.count();
  if (serviceCount === 0) {
    await Service.bulkCreate(seedServices);
  }

  const clientCount = await Client.count();
  if (clientCount === 0) {
    await Client.bulkCreate(seedClients);
  }

  const userCount = await User.count();
  if (userCount === 0) {
    await User.bulkCreate(seedUsers);
  }

  const roleCount = await Role.count();
  if (roleCount === 0) {
    await Role.bulkCreate(seedRoles);
  }

  const permissionCount = await Permission.count();
  if (permissionCount === 0) {
    await Permission.bulkCreate(seedPermissions);
  }

  const [adminUser, clientUser, adminRole, userRole, permissions] = await Promise.all([
    User.findOne({ where: { email: "admin@glowandshine.com" } }),
    User.findOne({ where: { email: "client@glowandshine.com" } }),
    Role.findOne({ where: { name: "admin" } }),
    Role.findOne({ where: { name: "user" } }),
    Permission.findAll(),
  ]);

  if (adminUser && adminRole) await adminUser.setRoles([adminRole]);
  if (clientUser && userRole) await clientUser.setRoles([userRole]);

  const permissionsByCode = Object.fromEntries(permissions.map((permission) => [permission.code, permission]));
  if (adminRole) {
    await adminRole.setPermissions(seedRolePermissions.admin.map((code) => permissionsByCode[code]).filter(Boolean));
  }
  if (userRole) {
    await userRole.setPermissions(seedRolePermissions.user.map((code) => permissionsByCode[code]).filter(Boolean));
  }

  const appointmentCount = await Appointment.count();
  if (appointmentCount === 0) {
    await Appointment.bulkCreate(seedAppointments);
  }
};

const syncDatabase = async ({ force = false, seed = true } = {}) => {
  await sequelize.sync({ force });
  if (seed) {
    await seedDatabase();
  }
};

module.exports = {
  sequelize,
  Service,
  Client,
  Appointment,
  User,
  Role,
  Permission,
  ActionLog,
  ObservationList,
  syncDatabase,
  seedDatabase,
  seedServices,
  seedClients,
  seedUsers,
  seedRoles,
  seedPermissions,
  seedRolePermissions,
  seedAppointments,
};
