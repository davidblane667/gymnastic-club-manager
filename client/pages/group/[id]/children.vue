<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else-if="selectedGroup">
      <v-row>
        <v-col cols="12">
          <h1>{{ selectedGroup.name }}</h1>
          <v-list lines="one">
            <child-item
              v-for="child in selectedGroup.children"
              :key="child.id"
              :child="child"
            />
          </v-list>
        </v-col>
      </v-row>
    </template>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="warning">Group not found</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { TGroup } from "~/types/group.types";
import { useGroupStore } from "~/stores/group/group";
import ChildItem from "~/components/ChildItem/ChildItem.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute("group");

const groupStore = useGroupStore();

const groups = computed<TGroup[]>(() => groupStore.getGroupList);
const selectedGroup = computed<TGroup | undefined>(() => {
  const groupId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return groups.value?.find((group: TGroup) => group.groupId === groupId);
});

const { pending } = await useAsyncData("GET_GROUP_LIST", () =>
  groupStore.GET_GROUP_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
