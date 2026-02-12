<template>
  <v-dialog
    :model-value="props.modelValue"
    max-width="500"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Add Child</v-card-title>

      <v-card-text class="pb-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="Child's Full Name"
              variant="outlined"
              :rules="[rules.required]"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="form.parent"
              label="Parent's Full Name"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="6">
            <v-text-field
              v-model="form.dateOfBirth"
              label="Date of Birth"
              variant="outlined"
              placeholder="DD.MM.YYYY"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="form.phoneNumber"
              label="Phone Number"
              variant="outlined"
              type="number"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="form.address"
              label="Address"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="form.note"
              label="Note"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-select
              v-model="form.groupId"
              :items="groups"
              item-value="groupId"
              item-title="name"
              label="Group"
              variant="outlined"
              clearable
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="6">
            <v-checkbox v-model="form.healthCertificate" label="Health Certificate" />
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="form.isPriority"
              label="Priority"
              color="amber"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="isSaving"
          :disabled="!form.name"
          @click="saveChild"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { TProps, TEmits } from "./AddChildDialog.types";
import { useChildrenStore } from "~/stores/children/children";
import { useGroupStore } from "~/stores/group/group";
import type { TGroup } from "~/types/group.types";

const props = defineProps<TProps>();
const emit = defineEmits<TEmits>();

const childrenStore = useChildrenStore();
const groupStore = useGroupStore();

const groups = computed<TGroup[]>(() => groupStore.getGroupList);

const isSaving = ref(false);

const initialForm = {
  name: "",
  parent: "",
  dateOfBirth: "",
  phoneNumber: undefined as number | undefined,
  address: "",
  note: "",
  healthCertificate: false,
  groupId: undefined as string | undefined,
  isPriority: false,
};

const form = ref({ ...initialForm });

const rules = {
  required: (v: string) => !!v || "Required",
};

const resetForm = () => {
  form.value = { ...initialForm };
};

const closeDialog = () => {
  emit("update:modelValue", false);
  resetForm();
};

const saveChild = async () => {
  if (!form.value.name) return;

  isSaving.value = true;

  await childrenStore.ADD_CHILD({
    name: form.value.name,
    parent: form.value.parent || undefined,
    dateOfBirth: form.value.dateOfBirth || undefined,
    phoneNumber: form.value.phoneNumber,
    address: form.value.address || undefined,
    note: form.value.note || undefined,
    healthCertificate: form.value.healthCertificate,
    groupId: form.value.groupId,
    isPriority: form.value.isPriority,
  });

  isSaving.value = false;
  emit("saved");
  closeDialog();
};

await useAsyncData(
  "GET_GROUP_LIST",
  () => groupStore.GET_GROUP_LIST().then(() => true),
  { dedupe: "defer" },
);
</script>
