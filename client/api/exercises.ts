import { api } from "./index";
import type { TExercise, TChildAttendance } from "~/types/exercise.types";

export type TAddExerciseRequest = {
  groupId: string;
  date: string;
  attendance: TChildAttendance[];
};

export type TExerciseQuery = {
  groupId?: string;
  month?: number;
  year?: number;
};

export const exercisesApi = {
  getAll: (query?: TExerciseQuery) => {
    const params = new URLSearchParams();
    if (query?.groupId) params.append("groupId", query.groupId);
    if (query?.month) params.append("month", String(query.month));
    if (query?.year) params.append("year", String(query.year));

    const queryString = params.toString();
    return api.get<TExercise[]>(`/exercises${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id: string) => api.get<TExercise>(`/exercises/${id}`),

  create: (data: TAddExerciseRequest) => api.post<TExercise>("/exercises", data),

  update: (id: string, data: Partial<TExercise>) =>
    api.put<TExercise>(`/exercises/${id}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/exercises/${id}`),

  getStats: (childId: string, groupId: string, month: number, year: number) =>
    api.get<{
      childId: string;
      totalExercises: number;
      present: number;
      absent: number;
      sick: number;
    }>(`/exercises/stats/${childId}?groupId=${groupId}&month=${month}&year=${year}`),
};
