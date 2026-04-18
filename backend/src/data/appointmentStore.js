let appointments = [
  { id: 1, service: "Manicure", date: "2024-03-10", time: "11:15 AM", price: 30, status: "Completed", rating: 5, userEmail: "client@test.com" },
];

let nextId = 2;

const getAll = () => appointments;

const getByEmail = (email) => appointments.filter(a => a.userEmail === email);

const create = (data) => {
  const newApp = { id: nextId++, status: "Upcoming", ...data };
  appointments.push(newApp);
  return newApp;
};

const remove = (id) => {
  const index = appointments.findIndex(a => a.id == id);
  if (index === -1) return null;
  appointments.splice(index, 1);
  return true;
};

module.exports = { getAll, getByEmail, create, remove };