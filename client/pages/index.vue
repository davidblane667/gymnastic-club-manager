<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row v-if="isAdmin">
        <v-col cols="12">
          <v-btn color="primary" block to="/group/edit">Add Group</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="group in groups" :key="group.groupId" cols="12" md="4">
        <v-card elevation="2">
          <div class="d-flex justify-space-between align-center">
            <v-card-title>
              <v-icon start> mdi-account-group </v-icon>
              {{ group.name }}
            </v-card-title>

            <v-menu v-if="isAdmin">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                />
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in menuItems"
                  :key="index"
                  :value="index"
                  @click="item.handler(group.groupId)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-card-actions>
            <v-btn
              append-icon="mdi-calendar"
              variant="tonal"
              :to="`/schedule/${group.groupId}`"
              >Schedule</v-btn
            >
            <v-btn
              append-icon="mdi-account-group"
              variant="tonal"
              :to="`/group/${group.groupId}/children`"
            >
              Children
            </v-btn>
          </v-card-actions>

          <v-card-actions>
            <v-btn
              block
              append-icon="mdi-plus-box"
              color="primary"
              variant="tonal"
              :to="`/exercise/${group.groupId}`"
            >
              Add Exercise
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      </v-row>
    </template>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Group</v-card-title>
        <v-card-text>
          Are you sure you want to delete group {{ groupToDelete?.name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            variant="elevated"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useGroupStore } from "~/stores/group/group";
import { useAuthStore } from "~/stores/auth/auth";
import { useChildrenStore } from "~/stores/children/children";
import type { TGroup } from "~/types/group.types";

definePageMeta({
  layout: "default",
});

const groupStore = useGroupStore();
const authStore = useAuthStore();
const childrenStore = useChildrenStore();

const isAdmin = computed<boolean>(() => authStore.isAdmin);

const menuItems = ref([
  {
    title: "Edit Group",
    handler: async (id: string) => {
      await navigateTo(`group/edit/${id}`);
    },
  },
  {
    title: "Edit Exercises",
    handler: async (id: string) => {
      await navigateTo(`exercise/${id}/edit`);
    },
  },
  { title: "Delete", handler: (id: string) => openDeleteDialog(id) },
]);

const groups = computed<TGroup[]>(() => groupStore.getGroupList);

const deleteDialog = ref(false);
const isDeleting = ref(false);
const groupToDeleteId = ref<string | null>(null);

const groupToDelete = computed(() =>
  groups.value.find((g) => g.groupId === groupToDeleteId.value),
);

const openDeleteDialog = (id: string) => {
  groupToDeleteId.value = id;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!groupToDeleteId.value) return;
  try {
    isDeleting.value = true;
    await groupStore.DELETE_GROUP(groupToDeleteId.value);
    await childrenStore.GET_CHILDREN_LIST();
    deleteDialog.value = false;
  } finally {
    isDeleting.value = false;
  }
};

const { pending } = await useAsyncData("GET_GROUP_LIST", () =>
  groupStore.GET_GROUP_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
