import { defineStore } from "pinia";
import { childrenApi } from "~/api/children";
import type { TChildrenState, TAddChild } from "~/stores/children/children.types";
import type { TChild } from "~/types/children.types";

export const useChildrenStore = defineStore("children", {
  state: (): TChildrenState => ({
    childrenList: [] as TChild[],
  }),

  getters: {
    getChildrenList: (state) => state.childrenList,
  },

  actions: {
    async GET_CHILDREN_LIST(): Promise<void> {
      try {
        this.childrenList = await childrenApi.getAll();
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async ADD_CHILD(data: TAddChild): Promise<TChild> {
      try {
        const newChild = await childrenApi.create(data);
        this.childrenList.push(newChild);
        return newChild;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async UPDATE_CHILD(data: TChild): Promise<void> {
      try {
        const updatedChild = await childrenApi.update(data.id, data);
        const index = this.childrenList.findIndex((child) => child.id === data.id);
        if (index !== -1) {
          this.childrenList[index] = updatedChild;
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async DELETE_CHILD(id: string): Promise<void> {
      try {
        await childrenApi.delete(id);
        this.childrenList = this.childrenList.filter((child) => child.id !== id);
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
});
