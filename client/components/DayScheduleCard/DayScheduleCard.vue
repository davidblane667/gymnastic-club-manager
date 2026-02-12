<template>
  <v-card elevation="2">
    <v-card-title class="bg-primary text-white">
      <v-icon start>mdi-calendar</v-icon>
      {{ props.title }}
    </v-card-title>

    <v-list v-if="props.lessons.length">
      <v-list-item
        v-for="lesson in props.lessons"
        :key="`${lesson.groupId}-${lesson.startTime}`"
        :to="props.showGroupLink ? `/group/${lesson.groupId}` : undefined"
      >
        <template #prepend>
          <v-avatar color="primary" size="40">
            <v-icon>mdi-account-group</v-icon>
          </v-avatar>
        </template>

        <v-list-item-title>{{ lesson.groupName }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-icon size="small">mdi-clock-outline</v-icon>
          {{ lesson.startTime }} - {{ lesson.endTime }}
        </v-list-item-subtitle>

        <template #append>
          <v-chip size="small" color="primary" variant="tonal">
            {{ lesson.childrenCount }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-card-text v-else class="text-center text-medium-emphasis mt-4">
      No classes
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { TProps } from "~/components/DayScheduleCard/DayScheduleCard.types";

const props = withDefaults(defineProps<TProps>(), {
  showGroupLink: true,
});
</script>
