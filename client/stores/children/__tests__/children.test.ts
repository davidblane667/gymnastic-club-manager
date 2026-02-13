import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useChildrenStore } from "../children";
import type { TChild } from "~/types/children.types";

vi.mock("~/api/children", () => ({
  childrenApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { childrenApi } from "~/api/children";

const mockChild: TChild = {
  id: "c1",
  name: "Alice Smith",
  healthCertificate: true,
  isPriority: false,
};

const mockChild2: TChild = {
  id: "c2",
  name: "Bob Johnson",
  healthCertificate: false,
  isPriority: true,
};

describe("Children Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("GET_CHILDREN_LIST — calls childrenApi.getAll, sets childrenList", async () => {
    vi.mocked(childrenApi.getAll).mockResolvedValue([mockChild, mockChild2]);

    const store = useChildrenStore();
    await store.GET_CHILDREN_LIST();

    expect(childrenApi.getAll).toHaveBeenCalled();
    expect(store.childrenList).toEqual([mockChild, mockChild2]);
  });

  it("ADD_CHILD — calls childrenApi.create, pushes to list", async () => {
    vi.mocked(childrenApi.create).mockResolvedValue(mockChild);

    const store = useChildrenStore();
    const result = await store.ADD_CHILD({
      name: "Alice Smith",
      healthCertificate: true,
      isPriority: false,
    });

    expect(childrenApi.create).toHaveBeenCalledWith({
      name: "Alice Smith",
      healthCertificate: true,
      isPriority: false,
    });
    expect(result).toEqual(mockChild);
    expect(store.childrenList).toHaveLength(1);
    expect(store.childrenList[0]).toEqual(mockChild);
  });

  it("UPDATE_CHILD — calls childrenApi.update, replaces item in list", async () => {
    const updated = { ...mockChild, name: "Alice Updated" };
    vi.mocked(childrenApi.update).mockResolvedValue(updated);

    const store = useChildrenStore();
    store.childrenList = [mockChild, mockChild2];

    await store.UPDATE_CHILD(updated);

    expect(childrenApi.update).toHaveBeenCalledWith("c1", updated);
    expect(store.childrenList[0].name).toBe("Alice Updated");
    expect(store.childrenList).toHaveLength(2);
  });

  it("DELETE_CHILD — calls childrenApi.delete, removes from list", async () => {
    vi.mocked(childrenApi.delete).mockResolvedValue({ message: "deleted" });

    const store = useChildrenStore();
    store.childrenList = [mockChild, mockChild2];

    await store.DELETE_CHILD("c1");

    expect(childrenApi.delete).toHaveBeenCalledWith("c1");
    expect(store.childrenList).toHaveLength(1);
    expect(store.childrenList[0].id).toBe("c2");
  });
});
