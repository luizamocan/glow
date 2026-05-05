const { Op } = require("sequelize");
const { Service, syncDatabase } = require("../models");

const toPlain = (model) => (model ? model.get({ plain: true }) : null);

const getAll = async ({ search = "", page, limit } = {}) => {
  const where = search
    ? {
        name: {
          [Op.like]: `%${search}%`,
        },
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

  const services = await Service.findAll(options);
  return services.map(toPlain);
};

const count = async ({ search = "" } = {}) => {
  const where = search
    ? {
        name: {
          [Op.like]: `%${search}%`,
        },
      }
    : undefined;

  return Service.count({ where });
};

const getById = async (id) => toPlain(await Service.findByPk(id));

const getByName = async (name) =>
  toPlain(
    await Service.findOne({
      where: {
        name: {
          [Op.like]: name,
        },
      },
    })
  );

const create = async (data) => toPlain(await Service.create(data));

const update = async (id, data) => {
  const service = await Service.findByPk(id);
  if (!service) return null;
  await service.update(data);
  return toPlain(service);
};

const remove = async (id) => {
  const deletedCount = await Service.destroy({ where: { id } });
  return deletedCount > 0;
};

const reset = async () => {
  await syncDatabase({ force: true });
};

module.exports = { getAll, count, getById, getByName, create, update, remove, reset };
