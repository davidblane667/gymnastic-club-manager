import type { TExercise } from "~/types/exercise.types";

type TExerciseState = {
  exerciseList: TExercise[];
};

type TAddExercise = Omit<TExercise, "id">;

type TChildAttendanceStats = {
  childId: string;
  totalExercises: number;
  present: number;
  absent: number;
  sick: number;
  finalPrice: number;
};

export type { TExerciseState, TAddExercise, TChildAttendanceStats };
