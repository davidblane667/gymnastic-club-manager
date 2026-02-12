import { api } from "./index";
import type { TChild } from "~/types/children.types";

export type TAddChildRequest = Omit<TChild, "id">;

export const childrenApi = {
  getAll: () => api.get<TChild[]>("/children"),

  getById: (id: string) => api.get<TChild>(`/children/${id}`),

  create: (data: TAddChildRequest) => api.post<TChild>("/children", data),

  update: (id: string, data: Partial<TChild>) =>
    api.put<TChild>(`/children/${id}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/children/${id}`),
};
