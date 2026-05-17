export const authHeaders = (user, extra = {}) => ({
  ...extra,
  ...(user?.id ? { "X-User-Id": String(user.id) } : {}),
  ...(user?.email ? { "X-User-Email": user.email } : {}),
  ...(user?.roleName || user?.role ? { "X-User-Role": user.roleName || user.role } : {}),
});
