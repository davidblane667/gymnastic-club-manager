<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h5 mb-4">Class Schedule</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="day in scheduleByDays"
          :key="day.dayOfWeek"
          cols="12"
          md="6"
          lg="4"
        >
          <DayScheduleCard :title="day.title" :lessons="day.lessons" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useGroupStore } from "~/stores/group/group";
import DayScheduleCard from "~/components/DayScheduleCard/DayScheduleCard.vue";
import type { TLesson } from "~/components/DayScheduleCard/DayScheduleCard.types";
import type { TGroup } from "~/types/group.types";
import type { TScheduleDay } from "~/types/schedule.types";
import { DAYS_OF_WEEK } from "~/constants/days";

definePageMeta({
  layout: "default",
});

const groupStore = useGroupStore();

const groups = computed<TGroup[]>(() => groupStore.getGroupList);

const scheduleByDays = computed<TScheduleDay[]>(() => {
  return DAYS_OF_WEEK.map((day) => {
    const lessons: TLesson[] = [];

    groups.value.forEach((group) => {
      group.schedule
        .filter((s) => s.dayOfWeek === day.value)
        .forEach((s) => {
          lessons.push({
            groupId: group.groupId,
            groupName: group.name,
            startTime: s.startTime,
            endTime: s.endTime,
            childrenCount: group.children.length,
          });
        });
    });

    lessons.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
      dayOfWeek: day.value,
      title: day.title,
      lessons,
    };
  });
});

const { pending } = await useAsyncData("GET_GROUP_LIST", () =>
  groupStore.GET_GROUP_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
