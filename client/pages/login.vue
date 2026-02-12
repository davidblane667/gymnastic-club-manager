<template>
  <v-card max-width="400" elevation="4">
    <v-card-title class="text-center">
      <h2 class="text-h5 font-weight-bold">Sign In</h2>
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="username"
          label="Username"
          type="text"
          prepend-icon="mdi-account"
          variant="outlined"
          required
          class="mb-2"
          :error-messages="error ? ' ' : ''"
        />

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          prepend-icon="mdi-lock"
          variant="outlined"
          required
          class="mb-2"
          :error-messages="error"
        />

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="isLoading"
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth/auth";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");

const handleLogin = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    await authStore.LOGIN(username.value, password.value);
    await navigateTo("/");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
};
</script>
