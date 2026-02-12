import type { TChild } from "./children.types";

type TScheduleSlot = {
  dayOfWeek: number; // 1 - Mon, 2 - Tue, ..., 7 - Sun
  startTime: string; // start time "09:00"
  endTime: string; // end time "10:00"
};

type TGroup = {
  groupId: string;
  name: string;
  schedule: TScheduleSlot[];
  children: TChild[];
  subscriptionPrice: number;
};

type TDayOfWeek = {
  title: string;
  value: number;
};

export type { TGroup, TScheduleSlot, TDayOfWeek };
