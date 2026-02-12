import type { TScheduleSlot, TGroup } from "~/types/group.types";
import type { TChild } from "~/types/children.types";

type TGroupState = {
  groupList: TGroup[];
  currentGroup: TGroup | null;
};

type TAddGroup = {
  name: string;
  schedule: TScheduleSlot[];
  children: TChild[];
  subscriptionPrice: number;
};

export type { TGroupState, TAddGroup };
