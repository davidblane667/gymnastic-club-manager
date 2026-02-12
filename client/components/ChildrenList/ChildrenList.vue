<template>
  <div>
    <v-text-field
      v-model="searchQuery"
      label="Search by name"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      clearable
      class="mt-4"
    />

    <v-btn
      v-if="isAdmin"
      color="primary"
      block
      class="my-4"
      prepend-icon="mdi-plus"
      @click="showAddDialog = true"
    >
      Add Child
    </v-btn>

    <v-list v-if="filteredChildrenList.length" lines="one">
      <ChildItem
        v-for="child in filteredChildrenList"
        :key="child.id"
        :child="child"
        :readonly="!isAdmin"
        :is-show-group="true"
      />
    </v-list>

    <v-alert v-else type="info" variant="tonal" class="mt-4">
      {{ searchQuery ? "Nothing found" : "List is empty" }}
    </v-alert>

    <AddChildDialog v-model="showAddDialog" @saved="onChildSaved" />
  </div>
</template>

<script lang="ts" setup>
import ChildItem from "~/components/ChildItem/ChildItem.vue";
import AddChildDialog from "~/components/AddChildDialog/AddChildDialog.vue";
import type { TChild } from "~/types/children.types";
import { useChildrenStore } from "~/stores/children/children";
import { useAuthStore } from "~/stores/auth/auth";

const childrenStore = useChildrenStore();
const authStore = useAuthStore();

const isAdmin = computed<boolean>(() => authStore.isAdmin);

const childrenList = computed<TChild[]>(() => childrenStore.getChildrenList);

const searchQuery = ref("");

const filteredChildrenList = computed<TChild[]>(() => {
  if (!searchQuery.value) {
    return childrenList.value;
  }

  const query = searchQuery.value.toLowerCase();
  return childrenList.value.filter((child) =>
    child.name.toLowerCase().includes(query)
  );
});

const showAddDialog = ref(false);

const onChildSaved = () => {
  // Child already added to store
};
</script>
