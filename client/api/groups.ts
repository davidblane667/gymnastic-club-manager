import { api } from "./index";
import type { TGroup, TScheduleSlot } from "~/types/group.types";

export type TAddGroupRequest = {
  name: string;
  schedule: TScheduleSlot[];
  childrenIds?: string[];
  subscriptionPrice?: number;
};

export type TUpdateGroupRequest = {
  name?: string;
  schedule?: TScheduleSlot[];
  childrenIds?: string[];
  subscriptionPrice?: number;
};

export const groupsApi = {
  getAll: () => api.get<TGroup[]>("/groups"),

  getById: (id: string) => api.get<TGroup>(`/groups/${id}`),

  create: (data: TAddGroupRequest) => api.post<TGroup>("/groups", data),

  update: (id: string, data: TUpdateGroupRequest) =>
    api.put<TGroup>(`/groups/${id}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/groups/${id}`),
};
