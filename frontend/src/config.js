const getDefaultApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000";

  const { protocol, hostname } = window.location;
  const apiHost =
    hostname === "localhost" || hostname === "127.0.0.1"
      ? "localhost"
      : hostname;

  return `${protocol}//${apiHost}:5000`;
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || getDefaultApiUrl();

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");
