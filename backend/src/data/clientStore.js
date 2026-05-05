const { Op } = require("sequelize");
const { Client } = require("../models");

const toPlain = (model) => (model ? model.get({ plain: true }) : null);

const getAll = async ({ search = "", page, limit } = {}) => {
  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }
    : undefined;

  const options = {
    where,
    order: [["id", "ASC"]],
  };

  if (page !== undefined && limit !== undefined) {
    options.limit = limit;
    options.offset = (page - 1) * limit;
  }

  const clients = await Client.findAll(options);
  return clients.map(toPlain);
};

const count = async ({ search = "" } = {}) => {
  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }
    : undefined;

  return Client.count({ where });
};

const getById = async (id) => toPlain(await Client.findByPk(id));

const getByEmail = async (email) =>
  toPlain(await Client.findOne({ where: { email: { [Op.like]: email } } }));

const create = async (data) => toPlain(await Client.create(data));

const findOrCreateByEmail = async ({ email, name, phone }) => {
  const [client] = await Client.findOrCreate({
    where: { email },
    defaults: {
      name: name || email.split("@")[0],
      phone: phone || null,
    },
  });
  return toPlain(client);
};

const update = async (id, data) => {
  const client = await Client.findByPk(id);
  if (!client) return null;
  await client.update(data);
  return toPlain(client);
};

const remove = async (id) => {
  const deletedCount = await Client.destroy({ where: { id } });
  return deletedCount > 0;
};

module.exports = {
  getAll,
  count,
  getById,
  getByEmail,
  create,
  findOrCreateByEmail,
  update,
  remove,
};
