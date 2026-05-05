const sequelize = require("../db/sequelize");
const Service = require("./Service");
const Client = require("./Client");
const Appointment = require("./Appointment");
const User = require("./User");

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
  syncDatabase,
  seedDatabase,
  seedServices,
  seedClients,
  seedUsers,
  seedAppointments,
};
