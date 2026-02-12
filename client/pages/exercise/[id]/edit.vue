<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h5 mb-4">Edit Exercises: {{ group?.name }}</h1>
        </v-col>
      </v-row>

      <v-row v-if="group">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedMonth"
          :items="MONTHS"
          item-title="title"
          item-value="value"
          label="Month"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedYear"
          :items="availableYears"
          label="Year"
          density="compact"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row v-if="group">
      <v-col cols="12">
        <v-expansion-panels v-if="filteredExercises.length" class="exercise-edit">
          <v-expansion-panel
            v-for="exercise in filteredExercises"
            :key="exercise.id"
          >
            <v-expansion-panel-title>
              <v-row no-gutters align="center">
                <v-col cols="auto">
                  <span class="font-weight-medium">{{ exercise.date }}</span>
                </v-col>
                <v-col cols="auto" class="ml-4">
                  <v-chip size="small" color="success" variant="tonal">
                    {{ getAttendanceStats(exercise).present }}
                  </v-chip>
                  <v-chip size="small" color="error" variant="tonal" class="ml-1">
                    {{ getAttendanceStats(exercise).absent }}
                  </v-chip>
                  <v-chip size="small" color="warning" variant="tonal" class="ml-1">
                    {{ getAttendanceStats(exercise).sick }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <AttendanceItem
                  v-for="child in group.children"
                  :key="child.id"
                  :child="child"
                  :status="getChildStatus(exercise, child.id)"
                  @update:status="(status) => onStatusChange(exercise, child.id, status)"
                />
              </v-list>
              <v-row class="mt-4" no-gutters>
                <v-col>
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="openDeleteDialog(exercise)"
                  >
                    Delete
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    v-if="hasChanges(exercise.id)"
                    :loading="savingExerciseId === exercise.id"
                    color="primary"
                    @click="onSave(exercise)"
                  >
                    Save
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-alert v-else type="info" variant="tonal" class="mt-4">
          No exercises for the selected period
        </v-alert>
      </v-col>
    </v-row>

      <v-row v-else>
        <v-col cols="12">
          <v-alert type="warning">Group not found</v-alert>
        </v-col>
      </v-row>
    </template>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Exercise</v-card-title>
        <v-card-text>
          Are you sure you want to delete the exercise from {{ exerciseToDelete?.date }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDeleteDialog">Cancel</v-btn>
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
import { useExerciseStore } from "~/stores/exercise/exercise";
import { MONTHS } from "~/constants/days";
import AttendanceItem from "~/components/AttendanceItem/AttendanceItem.vue";
import type { TGroup } from "~/types/group.types";
import type { TExercise, TAttendanceStatus } from "~/types/exercise.types";

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

const currentDate = new Date();
const selectedMonth = ref(currentDate.getMonth() + 1);
const selectedYear = ref(currentDate.getFullYear());

const availableYears = computed(() => {
  const years = [];
  for (let y = currentDate.getFullYear() - 2; y <= currentDate.getFullYear() + 1; y++) {
    years.push(y);
  }
  return years;
});

const filteredExercises = computed<TExercise[]>(() => {
  return exerciseStore.exerciseList
    .filter((e) => {
      if (e.groupId !== groupId.value) return false;
      const [, m, y] = e.date.split(".").map(Number);
      return m === selectedMonth.value && y === selectedYear.value;
    })
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split(".").map(Number);
      const [dayB, monthB, yearB] = b.date.split(".").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime();
    });
});

// Local state for changes
const localChanges = ref<Map<string, Map<string, TAttendanceStatus>>>(new Map());
const savingExerciseId = ref<string | null>(null);

// Delete state
const deleteDialog = ref(false);
const exerciseToDelete = ref<TExercise | null>(null);
const isDeleting = ref(false);

const openDeleteDialog = (exercise: TExercise) => {
  exerciseToDelete.value = exercise;
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  exerciseToDelete.value = null;
};

const confirmDelete = async () => {
  if (!exerciseToDelete.value) return;

  try {
    isDeleting.value = true;
    await exerciseStore.DELETE_EXERCISE(exerciseToDelete.value.id);
    closeDeleteDialog();
  } finally {
    isDeleting.value = false;
  }
};

const getChildStatus = (exercise: TExercise, childId: string): TAttendanceStatus => {
  const changes = localChanges.value.get(exercise.id);
  if (changes?.has(childId)) {
    return changes.get(childId)!;
  }
  const attendance = exercise.attendance.find((a) => a.childId === childId);
  return attendance?.status ?? "absent";
};

const onStatusChange = (exercise: TExercise, childId: string, status: TAttendanceStatus) => {
  if (!localChanges.value.has(exercise.id)) {
    localChanges.value.set(exercise.id, new Map());
  }
  localChanges.value.get(exercise.id)!.set(childId, status);
};

const hasChanges = (exerciseId: string): boolean => {
  const changes = localChanges.value.get(exerciseId);
  if (!changes || changes.size === 0) return false;

  const exercise = filteredExercises.value.find((e) => e.id === exerciseId);
  if (!exercise) return false;

  for (const [childId, newStatus] of changes) {
    const original = exercise.attendance.find((a) => a.childId === childId);
    const originalStatus = original?.status ?? "absent";
    if (newStatus !== originalStatus) return true;
  }
  return false;
};

const getAttendanceStats = (exercise: TExercise) => {
  let present = 0;
  let absent = 0;
  let sick = 0;

  if (!group.value) return { present, absent, sick };

  for (const child of group.value.children) {
    const status = getChildStatus(exercise, child.id);
    if (status === "present") present++;
    else if (status === "absent") absent++;
    else if (status === "sick") sick++;
  }

  return { present, absent, sick };
};

const onSave = async (exercise: TExercise) => {
  const changes = localChanges.value.get(exercise.id);
  if (!changes) return;

  try {
    savingExerciseId.value = exercise.id;

    const updatedAttendance = exercise.attendance.map((a) => {
      if (changes.has(a.childId)) {
        return { ...a, status: changes.get(a.childId)! };
      }
      return a;
    });

    // Add children who were not in attendance
    if (group.value) {
      for (const child of group.value.children) {
        if (!updatedAttendance.find((a) => a.childId === child.id)) {
          const status: TAttendanceStatus = changes.get(child.id) ?? "absent";
          updatedAttendance.push({ childId: child.id, status });
        }
      }
    }

    await exerciseStore.UPDATE_EXERCISE({
      ...exercise,
      attendance: updatedAttendance,
    });

    localChanges.value.delete(exercise.id);
  } finally {
    savingExerciseId.value = null;
  }
};

const { pending } = await useAsyncData("exercise-edit-data", async () => {
  await Promise.all([
    groupStore.GET_GROUP_LIST(),
    exerciseStore.GET_EXERCISE_LIST(),
  ]);
  return true;
}, { dedupe: "defer" });
</script>

<style lang="scss">
.exercise-edit {
  .v-expansion-panel-text__wrapper {
    padding: 8px 8px 16px;
  }
}
</style>
