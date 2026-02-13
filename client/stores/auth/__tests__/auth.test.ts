import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../auth";

vi.mock("~/api/auth", () => ({
  authApi: {
    login: vi.fn(),
    me: vi.fn(),
  },
}));

import { authApi } from "~/api/auth";

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("LOGIN — calls authApi.login, sets token/user/isAuthenticated", async () => {
    const mockResponse = {
      token: "jwt-token-123",
      user: { id: "1", username: "admin", role: "admin" as const },
    };
    vi.mocked(authApi.login).mockResolvedValue(mockResponse);

    const store = useAuthStore();
    await store.LOGIN("admin", "admin");

    expect(authApi.login).toHaveBeenCalledWith({
      username: "admin",
      password: "admin",
    });
    expect(store.token).toBe("jwt-token-123");
    expect(store.user).toEqual(mockResponse.user);
    expect(store.isAuthenticated).toBe(true);
  });

  it("CHECK_AUTH — calls authApi.me, sets user, returns true", async () => {
    const mockUser = { id: "1", username: "admin", role: "admin" as const };
    vi.mocked(authApi.me).mockResolvedValue(mockUser);

    const store = useAuthStore();
    store.token = "jwt-token-123";

    const result = await store.CHECK_AUTH();

    expect(authApi.me).toHaveBeenCalled();
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(result).toBe(true);
  });

  it("CHECK_AUTH — returns false when no token", async () => {
    const store = useAuthStore();
    store.token = null;

    const result = await store.CHECK_AUTH();

    expect(authApi.me).not.toHaveBeenCalled();
    expect(store.isAuthenticated).toBe(false);
    expect(result).toBe(false);
  });

  it("LOGOUT — clears state", () => {
    const store = useAuthStore();
    store.user = { id: "1", username: "admin", role: "admin" };
    store.token = "jwt-token-123";
    store.isAuthenticated = true;

    store.LOGOUT();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
