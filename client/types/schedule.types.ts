import type { TLesson } from "~/components/DayScheduleCard/DayScheduleCard.types";

type TScheduleDay = {
  dayOfWeek: number;
  title: string;
  lessons: TLesson[];
};

export type { TScheduleDay };
