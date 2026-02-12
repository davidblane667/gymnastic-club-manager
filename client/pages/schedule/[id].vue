<template>
  <v-container>
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h5 mb-4">Schedule: {{ group?.name }}</h1>
        </v-col>
      </v-row>

      <v-row v-if="group">
        <v-col
          v-for="day in scheduleByDays"
          :key="day.dayOfWeek"
          cols="12"
          md="6"
          lg="4"
        >
          <DayScheduleCard
            :title="day.title"
            :lessons="day.lessons"
            :show-group-link="false"
          />
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12">
          <v-alert type="warning">Group not found</v-alert>
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

const route = useRoute();
const groupStore = useGroupStore();

const groupId = computed<string>(() => {
  const param = route.params.id;
  return Array.isArray(param) ? param[0] : param;
});

const group = computed<TGroup | undefined>(() => {
  return groupStore.getGroupList.find((g) => g.groupId === groupId.value);
});

const scheduleByDays = computed<TScheduleDay[]>(() => {
  if (!group.value) return [];

  return DAYS_OF_WEEK.map((day) => {
    const lessons: TLesson[] = group
      .value!.schedule.filter((s) => s.dayOfWeek === day.value)
      .map((s) => ({
        groupId: group.value!.groupId,
        groupName: group.value!.name,
        startTime: s.startTime,
        endTime: s.endTime,
        childrenCount: group.value!.children.length,
      }));

    lessons.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
      dayOfWeek: day.value,
      title: day.title,
      lessons,
    };
  }).filter((day) => day.lessons.length > 0);
});

const { pending } = await useAsyncData("GET_GROUP_LIST", () =>
  groupStore.GET_GROUP_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
