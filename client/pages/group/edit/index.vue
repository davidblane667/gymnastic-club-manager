<template>
  <v-container class="group-edit">
    <v-row v-if="pending" justify="center" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-form validate-on="submit lazy" @submit.prevent="onSubmit">
          <v-text-field
            v-model="groupName"
            :rules="groupNameRules"
            label="Group Name"
          />

          <v-text-field
            v-model.number="subscriptionPrice"
            type="number"
            label="Subscription Price"
            class="mt-4"
          />

          <v-expansion-panels class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-title v-slot="{ expanded }">
                <v-row no-gutters>
                  <v-col class="text--secondary" cols="12">
                    <v-fade-transition leave-absolute>
                      <span v-if="expanded">Select day and time</span>
                      <span v-else>Schedule</span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <template v-if="scheduleList.length">
                  <div v-for="(schedule, index) in scheduleList" :key="index">
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          v-model="schedule.dayOfWeek"
                          label="Day of Week"
                          item-title="title"
                          item-value="value"
                          :rules="[(v: number) => !!v || 'Required']"
                          :items="DAYS_OF_WEEK"
                        />
                      </v-col>
                    </v-row>

                    <v-row justify="space-around" no-gutters>
                      <v-col cols="6">
                        <v-text-field
                          :model-value="schedule.startTime"
                          :rules="[(v: string) => !!v || 'Required']"
                          label="Start"
                          readonly
                        >
                          <v-dialog activator="parent" width="auto">
                            <v-time-picker
                              v-model="schedule.startTime"
                              format="24hr"
                            />
                          </v-dialog>
                        </v-text-field>
                      </v-col>

                      <v-col cols="6">
                        <v-text-field
                          :model-value="schedule.endTime"
                          :rules="[(v: string) => !!v || 'Required']"
                          label="End"
                          readonly
                        >
                          <v-dialog activator="parent" width="auto">
                            <v-time-picker
                              v-model="schedule.endTime"
                              format="24hr"
                            />
                          </v-dialog>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </template>

                <v-row>
                  <v-col cols="12">
                    <v-btn
                      append-icon="mdi-plus-box"
                      color="primary"
                      variant="tonal"
                      block
                      @click="onAdd"
                      >Add Class</v-btn
                    >
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels class="my-4">
            <v-expansion-panel>
              <v-expansion-panel-title v-slot="{ expanded }">
                <v-row no-gutters>
                  <v-col class="text--secondary" cols="12">
                    <v-fade-transition leave-absolute>
                      <span v-if="expanded">Select children</span>
                      <span v-else
                        >Children List
                        {{
                          selectedChildrenList.length
                            ? `(${selectedChildrenList.length})`
                            : ""
                        }}</span
                      >
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list
                  v-model:selected="selectedChildrenList"
                  lines="one"
                  select-strategy="leaf"
                >
                  <v-list-item
                    v-for="item in childrenList"
                    :key="item.id"
                    :title="item.name"
                    :value="item"
                  >
                    <template #prepend="{ isSelected, select }">
                      <v-list-item-action start>
                        <v-checkbox-btn
                          :model-value="isSelected"
                          @update:model-value="select"
                        />
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-btn
            :loading="isLoading"
            class="mt-2"
            text="Add Group"
            type="submit"
            color="primary"
            block
          />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { TScheduleSlot } from "~/types/group.types";
import type { TChild } from "~/types/children.types";
import { useChildrenStore } from "~/stores/children/children";
import { useGroupStore } from "~/stores/group/group";
import type { TAddGroup } from "~/stores/group/group.types";
import { DAYS_OF_WEEK } from "~/constants/days";

definePageMeta({
  layout: "default",
});

const groupStore = useGroupStore();
const childrenStore = useChildrenStore();

const groupNameRules = [
  (value: string) => {
    if (value?.length >= 3) return true;
    return "Name must be at least 3 characters";
  },
];

const isLoading = ref<boolean>(false);
const groupName = ref<string>("");
const subscriptionPrice = ref<number>(5000);
const selectedChildrenList = ref<TChild[]>([]);
const scheduleList = ref<TScheduleSlot[]>([{} as TScheduleSlot]);

const childrenList = computed<TChild[]>(() => childrenStore.getChildrenList);

const onAdd = (): void => {
  scheduleList.value.push({} as TScheduleSlot);
};
const onSubmit = async (): Promise<void> => {
  scheduleList.value = scheduleList.value.filter(
    (scheduleItem: TScheduleSlot) => scheduleItem.dayOfWeek,
  );

  try {
    isLoading.value = true;

    const formData: TAddGroup = {
      name: groupName.value.trim(),
      schedule: [...scheduleList.value],
      children: [...selectedChildrenList.value],
      subscriptionPrice: subscriptionPrice.value,
    };

    await groupStore.ADD_GROUP(formData);
    await navigateTo("/");
  } finally {
    isLoading.value = false;
  }
};

const { pending } = await useAsyncData("GET_CHILDREN_LIST", () =>
  childrenStore.GET_CHILDREN_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>

<style lang="scss">
.group-edit {
  .v-expansion-panel-text__wrapper {
    padding: 8px 8px 16px;
  }
}
</style>
