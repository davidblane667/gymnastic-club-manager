import { defineStore } from "pinia";
import { exercisesApi } from "~/api/exercises";
import type {
  TExerciseState,
  TAddExercise,
  TChildAttendanceStats,
} from "./exercise.types";
import type { TExercise } from "~/types/exercise.types";

export const useExerciseStore = defineStore("exercise", {
  state: (): TExerciseState => ({
    exerciseList: [],
  }),

  getters: {
    getExerciseList: (state) => state.exerciseList,
    getExercisesByGroupId: (state) => (groupId: string) =>
      state.exerciseList.filter((e) => e.groupId === groupId),

    getExercisesByMonth:
      (state) =>
      (month: number, year: number): TExercise[] => {
        return state.exerciseList.filter((e) => {
          const [, m, y] = e.date.split(".").map(Number);
          return m === month && y === year;
        });
      },

    getChildAttendanceStats() {
      return (
        childId: string,
        groupId: string,
        month: number,
        year: number,
        subscriptionPrice: number,
        isPriority: boolean = false,
      ): TChildAttendanceStats => {
        const groupExercises = this.getExercisesByMonth(month, year).filter(
          (e: TExercise) => e.groupId === groupId,
        );

        // Total group exercises for the month
        const totalGroupExercises = groupExercises.length;

        // Count child's stats from exercises where they appear in attendance
        let present = 0;
        let absent = 0;
        let sick = 0;

        groupExercises.forEach((e: TExercise) => {
          const attendance = e.attendance.find((a) => a.childId === childId);
          if (attendance) {
            if (attendance.status === "present") present++;
            else if (attendance.status === "absent") absent++;
            else if (attendance.status === "sick") sick++;
          }
        });

        // Child's exercises (only those where they were listed)
        const totalExercises = present + absent + sick;

        // Price per exercise = subscription / total group exercises
        const pricePerExercise =
          totalGroupExercises > 0
            ? subscriptionPrice / totalGroupExercises
            : 0;

        // Pay for present + unexcused absences (absent), sick days are free
        const paidExercises = present + absent;
        const priorityBonus = isPriority ? 1000 : 0;
        const finalPrice = Math.round(paidExercises * pricePerExercise) + priorityBonus;

        return {
          childId,
          totalExercises,
          present,
          absent,
          sick,
          finalPrice,
        };
      };
    },
  },

  actions: {
    async GET_EXERCISE_LIST(): Promise<void> {
      try {
        this.exerciseList = await exercisesApi.getAll();
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async ADD_EXERCISE(data: TAddExercise): Promise<TExercise> {
      try {
        const newExercise = await exercisesApi.create({
          groupId: data.groupId,
          date: data.date,
          attendance: data.attendance,
        });
        this.exerciseList.push(newExercise);
        return newExercise;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async UPDATE_EXERCISE(data: TExercise): Promise<void> {
      try {
        const updatedExercise = await exercisesApi.update(data.id, data);
        const index = this.exerciseList.findIndex((e) => e.id === data.id);
        if (index !== -1) {
          this.exerciseList[index] = updatedExercise;
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async DELETE_EXERCISE(id: string): Promise<void> {
      try {
        await exercisesApi.delete(id);
        this.exerciseList = this.exerciseList.filter((e) => e.id !== id);
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
});
