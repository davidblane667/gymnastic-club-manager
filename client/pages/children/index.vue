<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <template v-if="isAdmin">
        <v-tabs v-model="activeTab" color="primary">
          <v-tab value="children">Children List</v-tab>
          <v-tab value="payment">Payments</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item value="children">
            <ChildrenList />
          </v-tabs-window-item>

          <v-tabs-window-item value="payment">
            <PaymentList />
          </v-tabs-window-item>
        </v-tabs-window>
      </template>

      <template v-else>
        <ChildrenList />
      </template>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import ChildrenList from "~/components/ChildrenList/ChildrenList.vue";
import PaymentList from "~/components/PaymentList/PaymentList.vue";
import { useChildrenStore } from "~/stores/children/children";
import { useAuthStore } from "~/stores/auth/auth";

definePageMeta({
  layout: "default",
});

const childrenStore = useChildrenStore();
const authStore = useAuthStore();

const activeTab = ref("children");
const isAdmin = computed<boolean>(() => authStore.isAdmin);

const { pending } = await useAsyncData("GET_CHILDREN_LIST", () =>
  childrenStore.GET_CHILDREN_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
