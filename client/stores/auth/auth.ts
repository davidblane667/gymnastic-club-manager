import { defineStore } from "pinia";
import { authApi } from "~/api/auth";
import type { TAuthState } from "./auth.types";

const TOKEN_KEY = "auth_token";

export const useAuthStore = defineStore("auth", {
  state: (): TAuthState => ({
    user: null,
    token: import.meta.client ? localStorage.getItem(TOKEN_KEY) : null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getIsAuthenticated: (state) => state.isAuthenticated,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async LOGIN(username: string, password: string): Promise<void> {
      try {
        const response = await authApi.login({ username, password });
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;

        if (import.meta.client) {
          localStorage.setItem(TOKEN_KEY, response.token);
        }
      } catch (error) {
        this.LOGOUT();
        throw error;
      }
    },

    async CHECK_AUTH(): Promise<boolean> {
      if (!this.token) {
        this.isAuthenticated = false;
        return false;
      }

      try {
        const user = await authApi.me();
        this.user = user;
        this.isAuthenticated = true;
        return true;
      } catch {
        this.LOGOUT();
        return false;
      }
    },

    LOGOUT(): void {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
  },
});
