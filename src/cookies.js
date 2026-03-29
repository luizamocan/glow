// ══════════════════════════════
// Cookie utility functions
// ══════════════════════════════

export const setCookie = (name, value, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    try { return JSON.parse(decodeURIComponent(match[2])); }
    catch { return null; }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// ══════════════════════════════
// Activity tracking functions
// ══════════════════════════════

export const trackPageVisit = (page) => {
  const history = getCookie('page_history') || [];
  history.unshift({ page, timestamp: new Date().toISOString() });
  setCookie('page_history', history.slice(0, 10));
};

export const saveLastUser = (email) => {
  setCookie('last_user', email, 90);
};

export const getLastUser = () => getCookie('last_user');

export const saveMoodPreference = (mood) => {
  setCookie('preferred_mood', mood, 30);
};

export const getMoodPreference = () => getCookie('preferred_mood');

export const saveLastViewedService = (service) => {
  setCookie('last_service', { id: service.id, name: service.name }, 7);
};

export const getLastViewedService = () => getCookie('last_service');

export const incrementVisitCount = () => {
  const count = (getCookie('visit_count') || 0) + 1;
  setCookie('visit_count', count, 365);
  return count;
};

export const getVisitCount = () => getCookie('visit_count') || 0;