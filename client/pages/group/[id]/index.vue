<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" block>{{ groupName }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const route = useRoute("group");

const groupName = computed<string | undefined>(() => {
  const param = route.params.id;
  return Array.isArray(param) ? param[0] : param;
});
</script>
