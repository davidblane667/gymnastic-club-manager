type TProps = {
  modelValue: boolean;
};

type TEmits = {
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
};

export type { TProps, TEmits };
