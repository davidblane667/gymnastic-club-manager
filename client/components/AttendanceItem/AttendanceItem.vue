<template>
  <v-list-item>
    <v-list-item-title>{{
      formatShortName(props.child.name)
    }}</v-list-item-title>

    <template #append>
      <v-btn-toggle
        :model-value="props.status"
        mandatory
        density="compact"
        @update:model-value="emit('update:status', $event)"
      >
        <v-btn value="present" size="small" color="success">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn value="absent" size="small" color="error">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn value="sick" size="small" color="warning">
          <v-icon>mdi-hospital-box</v-icon>
        </v-btn>
      </v-btn-toggle>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import type { TProps, TEmits } from "./AttendanceItem.types";
import { formatShortName } from "~/utils/formatName";

const props = defineProps<TProps>();
const emit = defineEmits<TEmits>();
</script>
