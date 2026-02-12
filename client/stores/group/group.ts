import { defineStore } from "pinia";
import { groupsApi } from "~/api/groups";
import type { TAddGroup, TGroupState } from "./group.types";
import type { TGroup } from "~/types/group.types";

export const useGroupStore = defineStore("group", {
  state: (): TGroupState => ({
    groupList: [] as TGroup[],
    currentGroup: null,
  }),

  getters: {
    getGroupList: (state) => state.groupList,
    getCurrentGroup: (state) => state.currentGroup,
  },

  actions: {
    async GET_GROUP_LIST(): Promise<void> {
      try {
        this.groupList = await groupsApi.getAll();
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async GET_GROUP_BY_ID(id: string): Promise<TGroup> {
      try {
        this.currentGroup = await groupsApi.getById(id);
        return this.currentGroup;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async ADD_GROUP(data: TAddGroup): Promise<TGroup> {
      try {
        const childrenIds = data.children.map((c) => c.id);
        const newGroup = await groupsApi.create({
          name: data.name,
          schedule: data.schedule,
          childrenIds,
          subscriptionPrice: data.subscriptionPrice,
        });
        this.groupList.push(newGroup);
        return newGroup;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async UPDATE_GROUP(data: TGroup): Promise<void> {
      try {
        const childrenIds = data.children.map((c) => c.id);
        const updatedGroup = await groupsApi.update(data.groupId, {
          name: data.name,
          schedule: data.schedule,
          childrenIds,
          subscriptionPrice: data.subscriptionPrice,
        });

        const index = this.groupList.findIndex(
          (group) => group.groupId === data.groupId,
        );
        if (index !== -1) {
          this.groupList[index] = updatedGroup;
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async DELETE_GROUP(id: string): Promise<void> {
      try {
        await groupsApi.delete(id);
        this.groupList = this.groupList.filter((group) => group.groupId !== id);
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
});
