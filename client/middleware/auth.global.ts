import { useAuthStore } from "~/stores/auth/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip login page
  if (to.path === "/login") {
    return;
  }

  const authStore = useAuthStore();

  // Already authenticated, skip
  if (authStore.isAuthenticated) {
    return;
  }

  // Verify token
  const isAuthenticated = await authStore.CHECK_AUTH();

  if (!isAuthenticated) {
    return navigateTo("/login");
  }
});
