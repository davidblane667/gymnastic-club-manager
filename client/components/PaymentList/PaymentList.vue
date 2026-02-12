<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row no-gutters>
        <v-col cols="12">
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            item-title="label"
            item-value="value"
            label="Month"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-row v-for="group in groups" :key="group.groupId">
        <v-col cols="12">
          <v-card>
            <v-card-title
              class="bg-primary text-white d-flex justify-space-between align-center"
            >
              <span class="group-name text-truncate">
                <v-icon start>mdi-account-group</v-icon>
                {{ group.name }}
              </span>
              <v-chip
                color="white"
                variant="flat"
                size="small"
                class="flex-shrink-0 ml-2"
              >
                {{ group.subscriptionPrice }} / mo
              </v-chip>
            </v-card-title>

            <div class="bg-primary px-4 pb-2">
              <v-chip color="white" variant="tonal" size="small">
                Classes this month: {{ getGroupExerciseCount(group.groupId) }}
              </v-chip>
            </div>

            <v-list class="payment-chips">
              <v-list-item
                v-for="child in group.children"
                :key="child.id"
                class="py-3"
              >
                <v-list-item-title>
                  {{ formatShortName(child.name) }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap ga-2 mt-1">
                    <v-chip size="x-small" color="info" variant="tonal">
                      Total:
                      {{ getStats(child, group).totalExercises }}
                    </v-chip>
                    <v-chip size="x-small" color="success" variant="tonal">
                      Present: {{ getStats(child, group).present }}
                    </v-chip>
                    <v-chip size="x-small" color="error" variant="tonal">
                      Absent: {{ getStats(child, group).absent }}
                    </v-chip>
                    <v-chip size="x-small" color="warning" variant="tonal">
                      Sick: {{ getStats(child, group).sick }}
                    </v-chip>
                    <v-chip
                      v-if="child.isPriority"
                      size="x-small"
                      color="amber"
                      variant="tonal"
                    >
                      +1000 bonus
                    </v-chip>
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-right">
                    <div class="text-h6 font-weight-bold">
                      {{ getStats(child, group).finalPrice }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-divider />

            <v-card-text class="d-flex justify-space-between align-center">
              <span class="text-subtitle-1">Group Total:</span>
              <span class="text-h6 font-weight-bold">
                {{ getGroupTotal(group) }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { useGroupStore } from "~/stores/group/group";
import { useExerciseStore } from "~/stores/exercise/exercise";
import { formatShortName } from "~/utils/formatName";
import type { TGroup } from "~/types/group.types";
import type { TChild } from "~/types/children.types";
import type { TChildAttendanceStats } from "~/stores/exercise/exercise.types";

const groupStore = useGroupStore();
const exerciseStore = useExerciseStore();

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

const selectedMonth = ref({ month: currentMonth, year: currentYear });

const monthOptions = computed(() => {
  const options = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(currentYear, currentMonth - 1 - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    options.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value: { month, year },
    });
  }
  return options;
});

const groups = computed<TGroup[]>(() => groupStore.getGroupList);

const getStats = (child: TChild, group: TGroup): TChildAttendanceStats => {
  return exerciseStore.getChildAttendanceStats(
    child.id,
    group.groupId,
    selectedMonth.value.month,
    selectedMonth.value.year,
    group.subscriptionPrice,
    child.isPriority,
  );
};

const getGroupExerciseCount = (groupId: string): number => {
  return exerciseStore
    .getExercisesByMonth(selectedMonth.value.month, selectedMonth.value.year)
    .filter((e) => e.groupId === groupId).length;
};

const getGroupTotal = (group: TGroup): number => {
  return group.children.reduce((sum, child) => {
    return sum + getStats(child, group).finalPrice;
  }, 0);
};

const { pending } = await useAsyncData(
  "GET_EXERCISE_LIST",
  () => exerciseStore.GET_EXERCISE_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>

<style lang="scss" scoped>
.payment-chips :deep(.v-list-item-subtitle) {
  -webkit-line-clamp: unset;
  overflow: visible;
}
</style>
