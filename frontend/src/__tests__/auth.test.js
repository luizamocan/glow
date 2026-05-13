import { authHeaders } from "../api";
import { loginUser, registerUser, validateEmail, validatePassword } from "../components/auth";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("frontend authentication helpers", () => {
  test("login sends credentials to the backend and stores the returned token on the user", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 2, email: "client@glowandshine.com", role: "client" },
        token: "signed-token",
        expiresAt: "2026-05-13T18:00:00.000Z",
        inactivityTimeoutMs: 900000,
      }),
    });

    const user = await loginUser("client@glowandshine.com", "Client@123");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "client@glowandshine.com", password: "Client@123" }),
      })
    );
    expect(user.token).toBe("signed-token");
    expect(user.inactivityTimeoutMs).toBe(900000);
  });

  test("login returns null when the backend rejects credentials", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(loginUser("client@glowandshine.com", "wrong")).resolves.toBeNull();
  });

  test("register creates an account through the backend and returns a tokenized user", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 9, email: "mara@example.com", role: "client" },
        token: "new-token",
        expiresAt: "2026-05-13T18:00:00.000Z",
        inactivityTimeoutMs: 900000,
      }),
    });

    const user = await registerUser("Mara Ionescu", "mara@example.com", "Client@123", "0733333333");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/register"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Mara Ionescu",
          email: "mara@example.com",
          password: "Client@123",
          phone: "0733333333",
        }),
      })
    );
    expect(user.token).toBe("new-token");
  });

  test("authorization headers use bearer tokens instead of spoofable role headers", () => {
    expect(authHeaders({ token: "abc", id: 1, role: "admin" })).toEqual({
      Authorization: "Bearer abc",
    });
  });

  test("email and password validation reject weak login/register input", () => {
    expect(validateEmail("bad-email")).toBe(false);
    expect(validateEmail("client@example.com")).toBe(true);
    expect(validatePassword("short")).toEqual(expect.arrayContaining(["at least 8 characters"]));
    expect(validatePassword("Client@123")).toEqual([]);
  });
});
