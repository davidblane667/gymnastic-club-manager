<template>
  <v-expansion-panels class="child-item mt-4">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <v-row no-gutters align="center">
          <v-col class="text--secondary">
            <span>{{ props.child.name }}</span>
          </v-col>
          <v-col cols="auto">
            <v-icon
              v-if="editForm.isPriority"
              color="amber"
              size="small"
            >
              mdi-star
            </v-icon>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="editForm.parent"
              :readonly="props.readonly"
              label="Parent's Name"
            />
          </v-col>
        </v-row>
        <v-row justify="space-around" no-gutters>
          <v-col cols="6">
            <v-text-field
              v-model="editForm.dateOfBirth"
              :readonly="props.readonly"
              label="Date of Birth"
              placeholder="DD.MM.YYYY"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="editForm.phoneNumber"
              :readonly="props.readonly"
              label="Phone Number"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="editForm.address"
              :readonly="props.readonly"
              label="Address"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="editForm.note"
              :readonly="props.readonly"
              label="Note"
            />
          </v-col>
        </v-row>
        <v-row justify="space-around" no-gutters align="center">
          <v-col cols="5">
            <v-checkbox
              v-model="editForm.healthCertificate"
              :readonly="props.readonly"
              label="Health Certificate"
            />
          </v-col>
          <v-col cols="5">
            <v-checkbox
              v-model="editForm.isPriority"
              :readonly="props.readonly"
              label="Priority"
              color="amber"
            />
          </v-col>
          <v-col cols="12" v-if="isShowGroup">
            <v-select
              v-model="editForm.groupId"
              :readonly="props.readonly"
              :items="groups"
              item-value="groupId"
              item-title="name"
              label="Group"
              clearable
            />
          </v-col>
        </v-row>
        <v-row v-if="!props.readonly && hasChanges" no-gutters>
          <v-col cols="12">
            <v-btn
              :loading="isLoading"
              color="primary"
              block
              @click="onSave"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="!props.readonly" no-gutters class="mt-2">
          <v-col cols="12">
            <v-btn
              color="error"
              variant="text"
              block
              @click="deleteDialog = true"
            >
              Delete Child
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>Delete Child</v-card-title>
      <v-card-text>
        Are you sure you want to delete {{ props.child.name }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn
          color="error"
          variant="elevated"
          :loading="isDeleting"
          @click="onDelete"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { TProps } from "~/components/ChildItem/ChildItem.types";
import type { TGroup } from "~/types/group.types";
import type { TChild } from "~/types/children.types";
import { useGroupStore } from "~/stores/group/group";
import { useChildrenStore } from "~/stores/children/children";

const props = withDefaults(defineProps<TProps>(), {
  readonly: true,
  isShowGroup: false,
});

const groupStore = useGroupStore();
const childrenStore = useChildrenStore();

const groups = computed<TGroup[]>(() => groupStore.getGroupList);

const isLoading = ref(false);
const isDeleting = ref(false);
const deleteDialog = ref(false);

const editForm = ref({
  parent: props.child.parent,
  dateOfBirth: props.child.dateOfBirth,
  phoneNumber: props.child.phoneNumber,
  address: props.child.address,
  note: props.child.note,
  healthCertificate: props.child.healthCertificate,
  groupId: props.child.groupId,
  isPriority: props.child.isPriority,
});

const hasChanges = computed(() => {
  return (
    editForm.value.parent !== props.child.parent ||
    editForm.value.dateOfBirth !== props.child.dateOfBirth ||
    editForm.value.phoneNumber !== props.child.phoneNumber ||
    editForm.value.address !== props.child.address ||
    editForm.value.note !== props.child.note ||
    editForm.value.healthCertificate !== props.child.healthCertificate ||
    editForm.value.groupId !== props.child.groupId ||
    editForm.value.isPriority !== props.child.isPriority
  );
});

const onDelete = async () => {
  try {
    isDeleting.value = true;
    await childrenStore.DELETE_CHILD(props.child.id);
    deleteDialog.value = false;
  } finally {
    isDeleting.value = false;
  }
};

const onSave = async () => {
  try {
    isLoading.value = true;
    const updatedChild: TChild = {
      ...props.child,
      parent: editForm.value.parent,
      dateOfBirth: editForm.value.dateOfBirth,
      phoneNumber: editForm.value.phoneNumber,
      address: editForm.value.address,
      note: editForm.value.note,
      healthCertificate: editForm.value.healthCertificate,
      groupId: editForm.value.groupId,
      isPriority: editForm.value.isPriority,
    };
    await childrenStore.UPDATE_CHILD(updatedChild);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss">
.child-item {
  .v-expansion-panel-text__wrapper {
    padding: 8px 8px 16px;
  }
}
</style>
