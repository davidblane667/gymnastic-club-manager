import type { TChild } from "~/types/children.types";
import type { TAttendanceStatus } from "~/types/exercise.types";

type TProps = {
  child: TChild;
  status: TAttendanceStatus;
};

type TEmits = {
  (e: "update:status", status: TAttendanceStatus): void;
};

export type { TProps, TEmits };
