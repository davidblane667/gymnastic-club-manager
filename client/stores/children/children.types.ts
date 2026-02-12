import type { TChild } from "~/types/children.types";

type TChildrenState = {
  childrenList: TChild[];
};

type TAddChild = Omit<TChild, "id">;

export type { TChildrenState, TAddChild };
