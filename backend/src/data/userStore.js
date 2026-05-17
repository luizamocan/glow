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

const userInclude = [
  { model: Client, as: "client" },
  {
    model: Role,
    as: "roles",
    include: [{ model: Permission, as: "permissions" }],
  },
];

const findUser = async (where) =>
  withAuthorizationProfile(
    toPlain(
      await User.findOne({
        where,
        include: userInclude,
      })
    )
  );

const getByEmailWithPassword = async (email) => findUser({ email });

const getByEmail = async (email) => withoutPassword(await getByEmailWithPassword(email));

const updatePassword = async (id, password) => {
  await User.update({ password, authProvider: "local" }, { where: { id } });
};

const getById = async (id) => withoutPassword(await findUser({ id }));

const getByIdentifierWithPassword = async (identifier) => {
  const value = String(identifier || "").trim().toLowerCase();
  if (!value) return null;
  return value.includes("@")
    ? getByEmailWithPassword(value)
    : findUser({ username: value });
};

const getByGoogleId = async (googleId) => withoutPassword(await findUser({ googleId }));

const usernameFromEmail = (email) =>
  String(email || "")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 40);

const ensureUniqueUsername = async (preferred) => {
  const base = String(preferred || "user").toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 40) || "user";
  let candidate = base;
  let suffix = 1;
  while (await User.findOne({ where: { username: candidate } })) {
    candidate = `${base}_${suffix++}`;
  }
  return candidate;
};

const createClientUser = async ({ name, email, username, password, phone }) => {
  const client = await Client.create({ name, email, phone });
  const user = await User.create({
    name,
    email,
    username: await ensureUniqueUsername(username || usernameFromEmail(email)),
    password,
    authProvider: "local",
    role: "client",
    clientId: client.id,
  });

  const role = await Role.findOne({ where: { name: "user" } });
  if (role) await user.setRoles([role]);

  return getByEmail(email);
};

const createGoogleUser = async ({ name, email, googleId }) => {
  const client = await Client.create({ name, email, phone: null });
  const user = await User.create({
    name,
    email,
    username: await ensureUniqueUsername(usernameFromEmail(email)),
    password: null,
    googleId,
    authProvider: "google",
    role: "client",
    clientId: client.id,
  });

  const role = await Role.findOne({ where: { name: "user" } });
  if (role) await user.setRoles([role]);

  return getByEmail(email);
};

module.exports = {
  createClientUser,
  createGoogleUser,
  getByEmail,
  getByEmailWithPassword,
  getByGoogleId,
  getById,
  getByIdentifierWithPassword,
  updatePassword,
};
