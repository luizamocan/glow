const { User, Client } = require("../models");

const toPlain = (model) => (model ? model.get({ plain: true }) : null);

const withoutPassword = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const getByEmailWithPassword = async (email) =>
  toPlain(await User.findOne({ where: { email }, include: [{ model: Client, as: "client" }] }));

const getByEmail = async (email) => withoutPassword(await getByEmailWithPassword(email));

const createClientUser = async ({ name, email, password, phone }) => {
  const client = await Client.create({ name, email, phone });
  const user = await User.create({
    name,
    email,
    password,
    role: "client",
    clientId: client.id,
  });

  return withoutPassword(toPlain(user));
};

module.exports = { getByEmail, getByEmailWithPassword, createClientUser };
