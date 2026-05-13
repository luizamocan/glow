export const authHeaders = (user, extra = {}) => ({
  ...extra,
  ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
});
