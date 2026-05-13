const { User, Client, Role, Permission } = require("../models");

const toPlain = (model) => (model ? model.get({ plain: true }) : null);

const withAuthorizationProfile = (user) => {
  if (!user) return null;
  const roles = user.roles || [];
  const primaryRole = roles[0]?.name || user.role || "client";
  const permissions = [...new Set(roles.flatMap((role) => role.permissions?.map((permission) => permission.code) || []))];

  return {
    ...user,
    roleName: primaryRole,
    permissions,
    // Keep the original client-facing role name for existing navigation logic.
    role: primaryRole === "user" ? "client" : primaryRole,
  };
};

const withoutPassword = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return withAuthorizationProfile(safeUser);
};

const getByEmailWithPassword = async (email) =>
  withAuthorizationProfile(
    toPlain(
      await User.findOne({
        where: { email },
        include: [
          { model: Client, as: "client" },
          {
            model: Role,
            as: "roles",
            include: [{ model: Permission, as: "permissions" }],
          },
        ],
      })
    )
  );

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

  const role = await Role.findOne({ where: { name: "user" } });
  if (role) await user.setRoles([role]);

  return getByEmail(email);
};

const updatePassword = async (id, password) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update({ password });
  return withoutPassword(toPlain(user));
};

module.exports = { getByEmail, getByEmailWithPassword, createClientUser, updatePassword };
