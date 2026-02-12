<template>
  <div>
    <!-- Navigation -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <NuxtLink to="/" class="text-white text-decoration-none">
          Yasna
        </NuxtLink>
      </v-app-bar-title>

      <v-spacer />

      <v-btn icon @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <slot />
    </v-main>

    <!-- Logout confirmation dialog -->
    <v-dialog v-model="logoutDialog" max-width="320">
      <v-card>
        <v-card-title>Logout</v-card-title>
        <v-card-text>Are you sure you want to log out?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="logoutDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmLogout">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Bottom navigation -->
    <v-bottom-navigation v-model="activeRoute" grow>
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :value="item.value"
        @click="changeNavigationRoute(item.value)"
      >
        <v-icon>{{ item.icon }}</v-icon>

        <span>{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth/auth";

type TMenuItem = {
  title: string;
  icon?: string;
  value: string;
};

const route = useRoute();
const authStore = useAuthStore();

const getActiveRoute = (path: string): string => {
  if (path === "/") return "/";
  if (path.startsWith("/children")) return "/children";
  if (path.startsWith("/schedule")) return "/schedule";
  return "/";
};

const activeRoute = ref<string>(getActiveRoute(route.path));
const logoutDialog = ref(false);
const menuItems = ref<TMenuItem[]>([
  {
    title: "Groups",
    icon: "mdi-account-group",
    value: "/",
  },
  {
    title: "Children",
    icon: "mdi-account-multiple",
    value: "/children",
  },
  {
    title: "Schedule",
    icon: "mdi-calendar",
    value: "/schedule",
  },
]);

watch(
  () => route.path,
  (path) => {
    activeRoute.value = getActiveRoute(path);
  }
);

const handleLogout = () => {
  logoutDialog.value = true;
};

const confirmLogout = async () => {
  logoutDialog.value = false;
  authStore.LOGOUT();
  await navigateTo("/login");
};

const changeNavigationRoute = async (routeName: string) => {
  activeRoute.value = routeName;
  await navigateTo(routeName);
};
</script>
