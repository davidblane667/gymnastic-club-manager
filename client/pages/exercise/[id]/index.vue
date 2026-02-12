<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h5 mb-2">New Exercise</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-4">
            Group: {{ group?.name }}
          </p>

          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="selectedDateFormatted"
                label="Exercise Date"
                prepend-icon="mdi-calendar"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </template>
            <v-date-picker
              v-model="selectedDate"
              @update:model-value="dateMenu = false"
            />
          </v-menu>
        </v-col>
      </v-row>

      <v-row v-if="group">
        <v-col cols="12">
          <v-card>
            <v-card-title>Attendance</v-card-title>
            <v-list>
              <AttendanceItem
                v-for="child in group.children"
                :key="child.id"
                :child="child"
                :status="getChildStatus(child.id)"
                @update:status="updateChildStatus(child.id, $event)"
              />
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="group">
        <v-col cols="12">
          <v-btn
            color="primary"
            block
            size="large"
            :loading="isSaving"
            @click="saveExercise"
          >
            Add Exercise
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="!group">
        <v-col cols="12">
          <v-alert type="warning">Group not found</v-alert>
        </v-col>
      </v-row>

      <v-snackbar v-model="showSuccess" color="success" timeout="3000">
        Exercise added successfully
      </v-snackbar>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useGroupStore } from "~/stores/group/group";
import { useExerciseStore } from "~/stores/exercise/exercise";
import AttendanceItem from "~/components/AttendanceItem/AttendanceItem.vue";
import type { TGroup } from "~/types/group.types";
import type {
  TAttendanceStatus,
  TChildAttendance,
} from "~/types/exercise.types";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const groupStore = useGroupStore();
const exerciseStore = useExerciseStore();

const groupId = computed<string>(() => {
  const param = route.params.id;
  return Array.isArray(param) ? param[0] : param;
});

const group = computed<TGroup | undefined>(() => {
  return groupStore.getGroupList.find((g) => g.groupId === groupId.value);
});

const dateMenu = ref(false);
const selectedDate = ref<Date>(new Date());

const selectedDateFormatted = computed(() => {
  return selectedDate.value.toLocaleDateString("en-US");
});

const attendance = ref<Map<string, TAttendanceStatus>>(new Map());

const isSaving = ref(false);
const showSuccess = ref(false);

const getChildStatus = (childId: string): TAttendanceStatus => {
  return attendance.value.get(childId) ?? "present";
};

const updateChildStatus = (childId: string, status: TAttendanceStatus) => {
  attendance.value.set(childId, status);
};

const saveExercise = async () => {
  if (!group.value) return;

  isSaving.value = true;

  const attendanceList: TChildAttendance[] = group.value.children.map(
    (child) => ({
      childId: child.id,
      status: attendance.value.get(child.id) ?? "present",
    }),
  );

  await exerciseStore.ADD_EXERCISE({
    groupId: groupId.value,
    date: selectedDateFormatted.value,
    attendance: attendanceList,
  });

  isSaving.value = false;
  showSuccess.value = true;

  // Reset form
  attendance.value = new Map();

  // Redirect to home
  await navigateTo("/");
};

const { pending } = await useAsyncData(
  "GET_GROUP_LIST",
  () => groupStore.GET_GROUP_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
