import { authHeaders, clearSession, getSession } from "../api";
import {
  googleLoginUser,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  validateEmail,
  validatePassword,
} from "../components/auth";

beforeEach(() => {
  clearSession();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const authPayload = {
  token: "signed-token",
  expiresAt: new Date(Date.now() + 60000).toISOString(),
  expiresIn: 60,
  user: {
    id: 2,
    name: "Client",
    email: "client@example.com",
    role: "client",
  },
};

describe("authentication helpers", () => {
  test("validates email format", () => {
    expect(validateEmail("client@example.com")).toBe(true);
    expect(validateEmail("not-an-email")).toBe(false);
  });

  test("validates password strength", () => {
    expect(validatePassword("Client@123")).toEqual([]);
    expect(validatePassword("weak")).toEqual([
      "at least 8 characters",
      "one uppercase letter",
      "one number",
      "one special character",
    ]);
  });

  test("login stores token session and returns the safe user", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => authPayload,
    });

    const user = await loginUser("client@example.com", "Client@123");

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/auth/login"), expect.objectContaining({
      method: "POST",
    }));
    expect(user.email).toBe("client@example.com");
    expect(user.password).toBeUndefined();
    expect(getSession().token).toBe("signed-token");
    expect(authHeaders()).toEqual({ Authorization: "Bearer signed-token" });
  });

  test("login returns null when credentials are rejected", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid email or password" }),
    });

    await expect(loginUser("client@example.com", "bad")).resolves.toBeNull();
    expect(getSession()).toBeNull();
  });

  test("register stores token session", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => authPayload,
    });

    const user = await registerUser("Client", "client@example.com", "Client@123", "0711111111");

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/auth/register"), expect.objectContaining({
      method: "POST",
    }));
    expect(user.role).toBe("client");
    expect(getSession().user.email).toBe("client@example.com");
  });

  test("register surfaces backend validation errors", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "An account with this email already exists" }),
    });

    await expect(registerUser("Client", "client@example.com", "Client@123")).rejects.toThrow(
      "An account with this email already exists"
    );
  });

  test("google login stores the normal app token", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => authPayload,
    });

    const user = await googleLoginUser("google-id-token");

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/auth/google"), expect.objectContaining({
      method: "POST",
    }));
    expect(user.email).toBe("client@example.com");
    expect(getSession().token).toBe("signed-token");
  });

  test("requests and consumes a password reset token", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ resetToken: "reset-code" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Password reset successfully" }),
      });

    await expect(requestPasswordReset("client@example.com")).resolves.toEqual({ resetToken: "reset-code" });
    await expect(resetPassword("reset-code", "Client@456")).resolves.toEqual({
      message: "Password reset successfully",
    });
  });
});
